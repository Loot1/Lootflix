import { readFile, writeFile } from 'node:fs/promises'
import { LibraryEntry, LibrarySchema, MediaType } from './types'

export class TmdbLibraryStore {
    private readonly filePath: string

    constructor(filePath: string) {
        this.filePath = filePath
    }

    async read(): Promise<LibrarySchema> {
        const raw = await readFile(this.filePath, 'utf8')
        const parsed = JSON.parse(raw) as LibrarySchema & {
            sections?: { favorites?: LibraryEntry[]; watchHistory?: LibraryEntry[] }
        }

        if (Array.isArray(parsed.entries)) {
            return {
                language: parsed.language ?? 'fr-FR',
                entries: this.normalizeEntries(parsed.entries)
            }
        }

        const merged = new Map<string, LibraryEntry>()

        for (const favorite of parsed.sections?.favorites ?? []) {
            const key = this.makeKey(favorite)
            const current = merged.get(key) ?? {}
            merged.set(key, {
                ...current,
                ...this.normalizeEntry(favorite),
                types: this.mergeTypes(current.types, favorite.types),
                favorite: true,
                recentlyWatched: current.recentlyWatched ?? favorite.recentlyWatched ?? false,
                note: current.note ?? favorite.note ?? null,
                commentaire: current.commentaire ?? favorite.commentaire ?? null
            })
        }

        for (const watched of parsed.sections?.watchHistory ?? []) {
            const key = this.makeKey(watched)
            const current = merged.get(key) ?? {}
            merged.set(key, {
                ...current,
                ...this.normalizeEntry(watched),
                types: this.mergeTypes(current.types, watched.types),
                favorite: current.favorite ?? watched.favorite ?? false,
                recentlyWatched: true,
                note: current.note ?? watched.note ?? null,
                commentaire: current.commentaire ?? watched.commentaire ?? null
            })
        }

        return {
            language: parsed.language ?? 'fr-FR',
            entries: this.normalizeEntries([...merged.values()])
        }
    }

    async write(library: LibrarySchema): Promise<void> {
        const content = JSON.stringify(library, null, 2)
        await writeFile(this.filePath, `${content}\n`, 'utf8')
    }

    hasMedia(mediaType: MediaType, tmdbId: number, library: LibrarySchema): boolean {
        return library.entries.some((entry) => entry.mediaType === mediaType && entry.tmdbId === tmdbId)
    }

    private normalizeEntries(entries: LibraryEntry[]): LibraryEntry[] {
        return entries.map((entry) => this.normalizeEntry(entry))
    }

    private normalizeEntry(entry: LibraryEntry): LibraryEntry {
        return {
            tmdbId: entry.tmdbId,
            mediaType: entry.mediaType,
            query: entry.query,
            titleHint: entry.titleHint,
            types: this.normalizeTypes(entry.types),
            favorite: entry.favorite ?? false,
            recentlyWatched: entry.recentlyWatched ?? false,
            note: entry.note ?? null,
            commentaire: entry.commentaire ?? null
        }
    }

    private normalizeTypes(types?: string[]): string[] {
        if (!Array.isArray(types)) {
            return []
        }

        const normalized = new Set<string>()
        for (const type of types) {
            const trimmed = type.trim()
            if (trimmed.length > 0) {
                normalized.add(trimmed)
            }
        }

        return [...normalized]
    }

    private mergeTypes(currentTypes?: string[], incomingTypes?: string[]): string[] {
        return this.normalizeTypes([...(currentTypes ?? []), ...(incomingTypes ?? [])])
    }

    private makeKey(entry: LibraryEntry): string {
        return `${entry.mediaType ?? 'unknown'}:${entry.tmdbId ?? entry.query ?? entry.titleHint ?? Math.random()}`
    }
}
