import { NavLink, useParams } from 'react-router'
import { mediaBySlug, mediaCatalog } from '../data.js'
import { Badge, Card, Col, Container, Row } from 'react-bootstrap'
import { Carousel } from '../components'

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value))
}

function toFrenchStatus(status: string | null): string {
    if (!status) return 'Inconnu'

    const translations: Record<string, string> = {
        'Returning Series': 'En cours',
        Ended: 'Terminée',
        Canceled: 'Annulée',
        'In Production': 'En production',
        Planned: 'Planifiée',
        Pilot: 'Pilote',
        Released: 'Sorti',
        'Post Production': 'Post-production',
        Rumored: 'Rumeur'
    }

    return translations[status] ?? status
}

export function SerieRoute() {
    const { name } = useParams()
    const currentSlug = name ?? ''
    const current = mediaBySlug.get(currentSlug)

    if (!current) {
        return (
            <Container className="py-5">
                <Card className="serie-card p-4">
                    <h1 className="serie-title mb-3">Série introuvable</h1>
                    <p className="mb-3">Cette page n'existe pas ou le lien est invalide.</p>
                    <NavLink to="/" className="btn btn-danger">
                        Retour à l'accueil
                    </NavLink>
                </Card>
            </Container>
        )
    }

    const sameType = mediaCatalog
        .filter((media) => media.slug !== currentSlug)
        .filter((media) => media.mediaType === current.mediaType)

    const currentCustomTypes = current.types ?? []

    const withCustomTypes = sameType
        .map((media) => {
            const mediaCustomTypes = media.types ?? []
            const commonTypes = mediaCustomTypes.filter((type) => currentCustomTypes.includes(type)).length
            return { media, commonTypes }
        })
        .filter((entry) => entry.commonTypes > 0)
        .sort((a, b) => b.commonTypes - a.commonTypes || b.media.voteAverage - a.media.voteAverage)

    const withGenres = sameType
        .map((media) => {
            const commonGenres = media.genres.filter((genre) => current.genres.includes(genre)).length
            return { media, commonGenres }
        })
        .filter((entry) => entry.commonGenres > 0)
        .sort((a, b) => b.commonGenres - a.commonGenres || b.media.voteAverage - a.media.voteAverage)

    const fallback = [...sameType]
        .sort((a, b) => b.voteAverage - a.voteAverage)

    const baseRecommendation = currentCustomTypes.length > 0
        ? (withCustomTypes.length > 0 ? withCustomTypes.map((entry) => entry.media) : fallback)
        : (withGenres.length > 0 ? withGenres.map((entry) => entry.media) : fallback)

    const related = baseRecommendation
        .slice(0, 8)
        .map((media) => ({
            name: media.title,
            link: `/serie/${media.slug}`,
            image: media.backdropPath ?? media.posterPath ?? '',
            imageMode: 'backdrop' as const
        }))

    const topTags = current.genres.length > 0
        ? current.genres
        : ['Genres non renseignés']

    const hasPersonalReview = current.note !== null || Boolean(current.commentaire)
    const normalizedPersonalNote = current.note === null ? null : clamp(current.note, 0, 10)

    return (
        <Container className="py-5">
            <Row className="g-4 align-items-stretch">
                <Col lg={4}>
                    <img
                        src={current.posterPath ?? current.backdropPath ?? ''}
                        alt={`Affiche de ${current.title}`}
                        className="serie-cover"
                    />
                </Col>
                <Col lg={8}>
                    <Card className="serie-card h-100 p-4 p-lg-5 pb-3 pb-lg-4">
                        <div className="d-flex flex-wrap gap-2 align-self-start mb-3">
                            {topTags.map((tag, index) => (
                                <Badge bg="danger" className="serie-badge serie-tag" key={`${tag}-${index}`}>
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="serie-title mb-3">{current.title}</h1>
                        <p className="serie-description mb-4">
                            {current.overview || 'Aucun synopsis disponible en français pour ce titre.'}
                        </p>

                        {hasPersonalReview ? (
                            <div className="personal-review-card mb-4">
                                <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap flex-lg-nowrap mb-2">
                                    <p className="personal-review-title mb-0">Mon avis perso</p>
                                    {normalizedPersonalNote !== null ? (
                                        <span className="personal-review-score">{normalizedPersonalNote.toFixed(1)} / 10</span>
                                    ) : null}
                                </div>
                                {current.commentaire ? (
                                    <p className="personal-review-comment mb-0">“{current.commentaire}”</p>
                                ) : null}
                            </div>
                        ) : null}

                        <div className="serie-metadata-block mb-2">
                            <div className="serie-metadata-head d-flex justify-content-between align-items-center gap-3 mb-2">
                                <p className="serie-metadata-title mb-0">Informations TMDB</p>
                                <p className="serie-metadata-score mb-0" aria-label="Note TMDB">{current.voteAverage.toFixed(1)} / 10</p>
                            </div>
                            <div className="serie-metadata-grid">
                                <div>
                                    <span className="serie-metadata-label">Type</span>
                                    <p className="serie-metadata-value mb-0">{current.mediaType === 'tv' ? 'Série' : 'Film'}</p>
                                </div>
                                <div>
                                    <span className="serie-metadata-label">Sortie</span>
                                    <p className="serie-metadata-value mb-0">{current.firstReleaseDate ?? 'Inconnue'}</p>
                                </div>
                                {current.mediaType === 'tv' ? (
                                    <>
                                        <div>
                                            <span className="serie-metadata-label">Saisons</span>
                                            <p className="serie-metadata-value mb-0">{current.numberOfSeasons ?? 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="serie-metadata-label">Épisodes</span>
                                            <p className="serie-metadata-value mb-0">{current.numberOfEpisodes ?? 'N/A'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <span className="serie-metadata-label">Durée</span>
                                        <p className="serie-metadata-value mb-0">{current.runtimeMinutes ? `${current.runtimeMinutes} min` : 'N/A'}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="serie-metadata-label">Statut</span>
                                    <p className="serie-metadata-value mb-0">{toFrenchStatus(current.status)}</p>
                                </div>
                                <div>
                                    <span className="serie-metadata-label">Casting principal</span>
                                    <p className="serie-metadata-value mb-0">
                                        {current.topCast.length ? current.topCast.slice(0, 4).join(', ') : 'Non renseigné'}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </Card>
                </Col>
            </Row>

            <section className="mt-5">
                <div className="carousel-block">
                    <Carousel name="Autres séries similaires que j'ai regardées" items={related} />
                </div>
            </section>
        </Container>
    )
}