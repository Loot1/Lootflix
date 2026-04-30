import { generatedAt, generatedMedia, generatedSections } from './generated/tmdb-media.generated'
import type { CarouselItem } from './types/carousel'

function compact<T>(values: Array<T | null>): T[] {
    return values.filter((value): value is T => value !== null)
}

export const lastGeneratedAt = generatedAt
export const mediaCatalog = generatedMedia

export const mediaBySlug = new Map(generatedMedia.map((entry) => [entry.slug, entry]))

function toCarouselItem(slug: string): CarouselItem | null {
    const media = mediaBySlug.get(slug)
    if (!media) {
        return null
    }

    return {
        name: media.title,
        link: `/serie/${media.slug}`,
        image: media.posterPath ?? media.backdropPath ?? '',
        imageMode: 'poster'
    }
}

export const favoriteItems = compact(generatedSections.favorites.map(toCarouselItem))
export const recentItems = compact(generatedSections.watchHistory.map(toCarouselItem))
