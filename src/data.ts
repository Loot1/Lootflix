import { generatedAt, generatedMedia, generatedSections } from './generated/tmdb-media.generated'

type CarouselItem = {
    name: string
    link: string
    image: string
    imageMode: 'poster' | 'backdrop'
}

function toCarouselItem(slug: string): CarouselItem | null {
    const media = generatedMedia.find((entry) => entry.slug === slug)
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

function compact<T>(values: Array<T | null>): T[] {
    return values.filter((value): value is T => value !== null)
}

export const lastGeneratedAt = generatedAt
export const mediaCatalog = generatedMedia

export const mediaBySlug = new Map(generatedMedia.map((entry) => [entry.slug, entry]))

export const favoriteItems = compact(generatedSections.favorites.map(toCarouselItem))
export const recentItems = compact(generatedSections.watchHistory.map(toCarouselItem))
