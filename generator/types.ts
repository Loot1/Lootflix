export type MediaType = 'tv' | 'movie'
export type SectionName = 'favorites' | 'watchHistory'

export type LibraryEntry = {
    tmdbId?: number
    mediaType?: MediaType
    query?: string
    titleHint?: string
    types?: string[]
    favorite?: boolean
    recentlyWatched?: boolean
    note?: number | null
    commentaire?: string | null
}

export type LibrarySchema = {
    language: string
    entries: LibraryEntry[]
}

export type TmdbSearchResult = {
    id: number
    media_type: 'tv' | 'movie' | 'person'
    name?: string
    title?: string
    popularity?: number
}

export type ResolvedReference = {
    tmdbId: number
    mediaType: MediaType
    title: string
}

export type GeneratedMedia = {
    tmdbId: number
    mediaType: MediaType
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
