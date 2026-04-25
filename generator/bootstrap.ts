import process from 'node:process'
import { IMAGE_JPEG_QUALITY, LIBRARY_FILE } from './config'
import { ImageOptimizer } from './ImageOptimizer'
import { RateLimiter } from './RateLimiter'
import { TmdbApiClient } from './TmdbApiClient'
import { TmdbCliApplication } from './TmdbCliApplication'
import { TmdbLibraryStore } from './TmdbLibraryStore'
import { TmdbStaticGenerator } from './TmdbStaticGenerator'

export function buildTmdbCliApplication(): TmdbCliApplication {
    const api = new TmdbApiClient({
        token: process.env.TMDB_TOKEN,
        key: process.env.TMDB_KEY,
        limiter: new RateLimiter(35),
        imageOptimizer: new ImageOptimizer(IMAGE_JPEG_QUALITY)
    })

    const store = new TmdbLibraryStore(LIBRARY_FILE)
    const generator = new TmdbStaticGenerator(api, store)

    return new TmdbCliApplication(generator)
}
