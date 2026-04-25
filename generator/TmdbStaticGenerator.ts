import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { IMAGE_DIR, LIBRARY_FILE, OUTPUT_FILE, ROOT } from './config'
import { TmdbApiClient } from './TmdbApiClient'
import { TmdbLibraryStore } from './TmdbLibraryStore'
import { GeneratedMedia, LibraryEntry, MediaType, ResolvedReference, SectionName } from './types'

export class TmdbStaticGenerator {
    private readonly api: TmdbApiClient
    private readonly libraryStore: TmdbLibraryStore

    constructor(api: TmdbApiClient, libraryStore: TmdbLibraryStore) {
        this.api = api
        this.libraryStore = libraryStore
    }

    async generateAll(): Promise<void> {
        await mkdir(IMAGE_DIR, { recursive: true })

        const library = await this.libraryStore.read()
        const sectionSlugs: Record<SectionName, string[]> = {
            favorites: [],
            watchHistory: []
        }

        const mediaByKey = new Map<string, GeneratedMedia>()

        for (const entry of library.entries) {
            const resolved = await this.resolveAndPersistEntry(entry, library.language)
            if (!resolved) {
                const label = entry.query ?? entry.titleHint ?? 'entrée sans nom'
                console.warn(`[TMDB] Introuvable: ${label}`)
                continue
            }

            entry.tmdbId = resolved.tmdbId
            entry.mediaType = resolved.mediaType
            entry.titleHint = resolved.title

            const mediaKey = `${resolved.mediaType}:${resolved.tmdbId}`
            if (!mediaByKey.has(mediaKey)) {
                const media = await this.fetchMediaFromTmdb(resolved.tmdbId, resolved.mediaType, library.language)
                mediaByKey.set(mediaKey, media)
                console.log(`[TMDB] OK -> ${media.title} (${media.mediaType}:${media.tmdbId})`)
            }

            const media = mediaByKey.get(mediaKey)
            if (media && entry.note !== null && entry.note !== undefined) {
                media.note = entry.note
            }

            if (media && entry.commentaire && entry.commentaire.trim().length > 0) {
                media.commentaire = entry.commentaire.trim()
            }

            if (media && entry.types && entry.types.length > 0) {
                media.types = this.uniqueStrings([...media.types, ...entry.types])
            }

            if (media && entry.favorite) {
                sectionSlugs.favorites.push(media.slug)
            }

            if (media && entry.recentlyWatched) {
                sectionSlugs.watchHistory.push(media.slug)
            }
        }

        await this.libraryStore.write(library)

        const generatedMedia = [...mediaByKey.values()].sort((a, b) => a.title.localeCompare(b.title, 'fr'))
        const generatedSections = {
            favorites: this.uniqueStrings(sectionSlugs.favorites),
            watchHistory: this.uniqueStrings(sectionSlugs.watchHistory)
        }

        const outputContent = this.toTsFileContent({
            generatedAt: new Date().toISOString(),
            generatedMedia,
            generatedSections
        })

        await mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
        await writeFile(OUTPUT_FILE, outputContent, 'utf8')

        console.log('\nGénération terminée.')
        console.log(`- Médias sauvegardés: ${generatedMedia.length}`)
        console.log(`- Fichier: ${path.relative(ROOT, OUTPUT_FILE)}`)
        console.log(`- Bibliothèque IDs: ${path.relative(ROOT, LIBRARY_FILE)}`)
        console.log(`- Images locales: ${path.relative(ROOT, IMAGE_DIR)}`)
    }

    async addSingleMedia(params: {
        title: string
        section: SectionName
        mediaTypePreference: MediaType
        regenerate: boolean
    }): Promise<void> {
        const library = await this.libraryStore.read()

        const resolved = await this.api.searchBestMatch(params.title, library.language, params.mediaTypePreference)
        if (!resolved) {
            throw new Error(`Aucun résultat TMDB pour: ${params.title}`)
        }

        if (this.libraryStore.hasMedia(resolved.mediaType, resolved.tmdbId, library)) {
            console.log(`[TMDB] Déjà présent dans la bibliothèque: ${resolved.title} (${resolved.mediaType}:${resolved.tmdbId})`)
            const existing = library.entries.find((entry) => entry.mediaType === resolved.mediaType && entry.tmdbId === resolved.tmdbId)
            if (existing) {
                if (params.section === 'favorites') {
                    existing.favorite = true
                } else {
                    existing.recentlyWatched = true
                }
                await this.libraryStore.write(library)
            }
        } else {
            library.entries.push({
                tmdbId: resolved.tmdbId,
                mediaType: resolved.mediaType,
                titleHint: resolved.title,
                types: [],
                favorite: params.section === 'favorites',
                recentlyWatched: params.section === 'watchHistory',
                note: null,
                commentaire: null
            })
            await this.libraryStore.write(library)
            console.log(`[TMDB] Ajouté dans ${params.section}: ${resolved.title} (${resolved.mediaType}:${resolved.tmdbId})`)
        }

        if (params.regenerate) {
            await this.generateAll()
        }
    }

    private async resolveAndPersistEntry(entry: LibraryEntry, language: string): Promise<ResolvedReference | null> {
        if (entry.tmdbId && entry.mediaType) {
            const title = entry.titleHint ?? entry.query ?? `${entry.mediaType}:${entry.tmdbId}`
            return { tmdbId: entry.tmdbId, mediaType: entry.mediaType, title }
        }

        const searchQuery = entry.query ?? entry.titleHint
        if (!searchQuery) {
            return null
        }

        return this.api.searchBestMatch(searchQuery, language, entry.mediaType ?? 'tv')
    }

    private async fetchMediaFromTmdb(tmdbId: number, mediaType: MediaType, language: string): Promise<GeneratedMedia> {
        const details = await this.api.fetchDetails(tmdbId, mediaType, language)
        const credits = await this.api.fetchCredits(tmdbId, mediaType, language)

        const title = mediaType === 'tv' ? details.name : details.title
        const originalTitle = mediaType === 'tv' ? details.original_name : details.original_title
        const firstReleaseDate = mediaType === 'tv' ? details.first_air_date : details.release_date
        const runtimeMinutes =
            mediaType === 'tv'
                ? Array.isArray(details.episode_run_time) && details.episode_run_time.length > 0
                    ? details.episode_run_time[0]
                    : null
                : details.runtime ?? null

        const topCast = this.uniqueStrings((credits.cast ?? []).slice(0, 8).map((actor: any) => actor.name ?? ''))
        const slug = this.slugify(title ?? `${mediaType}-${tmdbId}`)

        const posterPath = await this.api.downloadImage(
            details.poster_path ?? null,
            path.join('generated', 'images', `${slug}-${tmdbId}-poster.jpg`)
        )

        const backdropPath = await this.api.downloadImage(
            details.backdrop_path ?? null,
            path.join('generated', 'images', `${slug}-${tmdbId}-backdrop.jpg`)
        )

        return {
            tmdbId,
            mediaType,
            slug,
            title: title ?? `${mediaType}-${tmdbId}`,
            originalTitle: originalTitle ?? title ?? `${mediaType}-${tmdbId}`,
            overview: details.overview ?? '',
            firstReleaseDate: firstReleaseDate ?? null,
            lastReleaseDate: mediaType === 'tv' ? details.last_air_date ?? null : null,
            status: details.status ?? null,
            genres: this.uniqueStrings((details.genres ?? []).map((genre: any) => genre.name ?? '')),
            voteAverage: Number(details.vote_average ?? 0),
            originCountries:
                mediaType === 'tv'
                    ? this.uniqueStrings(details.origin_country ?? [])
                    : this.uniqueStrings((details.production_countries ?? []).map((country: any) => country.iso_3166_1 ?? '')),
            spokenLanguages: this.uniqueStrings((details.spoken_languages ?? []).map((lang: any) => lang.name ?? '')),
            topCast,
            numberOfSeasons: mediaType === 'tv' ? (details.number_of_seasons ?? null) : null,
            numberOfEpisodes: mediaType === 'tv' ? (details.number_of_episodes ?? null) : null,
            runtimeMinutes,
            posterPath,
            backdropPath,
            types: [],
            note: null,
            commentaire: null
        }
    }

    private slugify(input: string): string {
        return input
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    private uniqueStrings(values: string[]): string[] {
        const set = new Set<string>()
        for (const value of values) {
            const trimmed = value.trim()
            if (trimmed.length > 0) {
                set.add(trimmed)
            }
        }
        return [...set]
    }

    private toTsFileContent(payload: {
        generatedAt: string
        generatedMedia: GeneratedMedia[]
        generatedSections: { favorites: string[]; watchHistory: string[] }
    }): string {
        const generatedAtJson = JSON.stringify(payload.generatedAt)
        const generatedMediaJson = JSON.stringify(payload.generatedMedia, null, 4)
        const generatedSectionsJson = JSON.stringify(payload.generatedSections, null, 4)

        return `/* eslint-disable */

export type GeneratedMedia = {
    tmdbId: number
    mediaType: 'tv' | 'movie'
    slug: string
    title: string
    originalTitle: string
    overview: string
    firstReleaseDate: string | null
    lastReleaseDate: string | null
    status: string | null
    genres: string[]
    voteAverage: number
    originCountries: string[]
    spokenLanguages: string[]
    topCast: string[]
    numberOfSeasons: number | null
    numberOfEpisodes: number | null
    runtimeMinutes: number | null
    posterPath: string | null
    backdropPath: string | null
    types: string[]
    note: number | null
    commentaire: string | null
}

export const generatedAt = ${generatedAtJson}

export const generatedMedia: GeneratedMedia[] = ${generatedMediaJson}

export const generatedSections = ${generatedSectionsJson}
`
    }
}
