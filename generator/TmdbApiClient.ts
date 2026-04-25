import path from 'node:path'
import { ROOT, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from './config'
import { ImageOptimizer } from './ImageOptimizer'
import { RateLimiter } from './RateLimiter'
import { MediaType, ResolvedReference, TmdbSearchResult } from './types'

type TmdbApiClientParams = {
    token?: string
    key?: string
    limiter: RateLimiter
    imageOptimizer: ImageOptimizer
}

export class TmdbApiClient {
    private readonly token?: string
    private readonly key?: string
    private readonly limiter: RateLimiter
    private readonly imageOptimizer: ImageOptimizer

    constructor(params: TmdbApiClientParams) {
        this.token = params.token
        this.key = params.key
        this.limiter = params.limiter
        this.imageOptimizer = params.imageOptimizer

        if (!this.token && !this.key) {
            throw new Error('TMDB_TOKEN ou TMDB_KEY manquant dans le .env')
        }
    }

    private get authHeaders(): HeadersInit {
        if (this.token) {
            return {
                Accept: 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        }

        return { Accept: 'application/json' }
    }

    private async request<T>(resourcePath: string, params: Record<string, string> = {}, attempt = 1): Promise<T> {
        await this.limiter.waitTurn()

        const searchParams = new URLSearchParams(params)
        if (!this.token && this.key) {
            searchParams.set('api_key', this.key)
        }

        const response = await fetch(`${TMDB_BASE_URL}${resourcePath}?${searchParams.toString()}`, {
            headers: this.authHeaders
        })

        if (response.status === 429 && attempt <= 5) {
            const retryAfterSeconds = Number(response.headers.get('retry-after') ?? '1')
            const delayMs = Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : 1000
            console.warn(`[TMDB] 429 rate limit sur ${resourcePath}. Retry dans ${delayMs}ms`)
            await new Promise((resolve) => setTimeout(resolve, delayMs))
            return this.request<T>(resourcePath, params, attempt + 1)
        }

        if (!response.ok) {
            const body = await response.text()
            throw new Error(`[TMDB] ${resourcePath} -> ${response.status}: ${body}`)
        }

        return (await response.json()) as T
    }

    async searchBestMatch(query: string, language: string, preferredMediaType: MediaType = 'tv'): Promise<ResolvedReference | null> {
        const search = await this.request<{ results: TmdbSearchResult[] }>('/search/multi', {
            query,
            language,
            include_adult: 'false'
        })

        const candidates = search.results.filter((result) => result.media_type === 'tv' || result.media_type === 'movie')
        if (candidates.length === 0) {
            return null
        }

        const normalizedQuery = this.normalizeText(query)

        candidates.sort((a, b) => {
            const titleA = this.normalizeText(a.name ?? a.title ?? '')
            const titleB = this.normalizeText(b.name ?? b.title ?? '')

            const scoreA = this.computeCandidateScore(titleA, normalizedQuery, a.media_type, preferredMediaType, a.popularity ?? 0)
            const scoreB = this.computeCandidateScore(titleB, normalizedQuery, b.media_type, preferredMediaType, b.popularity ?? 0)

            return scoreB - scoreA
        })

        const winner = candidates[0]
        if (winner.media_type !== 'tv' && winner.media_type !== 'movie') {
            return null
        }

        return {
            tmdbId: winner.id,
            mediaType: winner.media_type,
            title: winner.name ?? winner.title ?? query
        }
    }

    private normalizeText(value: string): string {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim()
    }

    private computeCandidateScore(
        candidateTitle: string,
        normalizedQuery: string,
        mediaType: 'tv' | 'movie' | 'person',
        preferredMediaType: MediaType,
        popularity: number
    ): number {
        let score = 0

        if (candidateTitle === normalizedQuery) {
            score += 1000
        } else if (candidateTitle.startsWith(normalizedQuery)) {
            score += 500
        } else if (candidateTitle.includes(normalizedQuery)) {
            score += 250
        }

        if (mediaType === preferredMediaType) {
            score += 100
        } else if (mediaType === 'tv') {
            score += 40
        }

        score += Math.min(popularity, 1000) / 100
        return score
    }

    async fetchDetails(tmdbId: number, mediaType: MediaType, language: string): Promise<any> {
        return this.request<any>(`/${mediaType}/${tmdbId}`, { language })
    }

    async fetchCredits(tmdbId: number, mediaType: MediaType, language: string): Promise<any> {
        return this.request<any>(`/${mediaType}/${tmdbId}/credits`, { language })
    }

    async downloadImage(imagePathFromTmdb: string | null, outputRelativePath: string): Promise<string | null> {
        if (!imagePathFromTmdb) {
            return null
        }

        const outputAbsolutePath = path.join(ROOT, 'public', outputRelativePath)
        const imageUrl = `${TMDB_IMAGE_BASE_URL}${imagePathFromTmdb}`
        const response = await fetch(imageUrl)

        if (!response.ok) {
            console.warn(`[TMDB] Image indisponible: ${imageUrl}`)
            return null
        }

        const bytes = new Uint8Array(await response.arrayBuffer())
        await this.imageOptimizer.saveOptimizedJpeg(bytes, outputAbsolutePath)

        return `/${outputRelativePath.replaceAll('\\', '/')}`
    }
}
