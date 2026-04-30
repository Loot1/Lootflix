import { Badge, Col, Container, Row } from 'react-bootstrap'
import { Carousel } from '../components'
import { favoriteItems, lastGeneratedAt, mediaCatalog, recentItems } from '../data'

function selectFromType(type: string, limit = 12) {
    return mediaCatalog
        .filter((media) => media.mediaType === 'tv')
        .filter((media) => media.types.includes(type))
        .filter((media) => media.posterPath !== null)
        .slice(0, limit)
        .map((media) => ({
            name: media.title,
            link: `/serie/${media.slug}`,
            image: media.posterPath as string,
            imageMode: 'poster' as const
        }))
}

const generatedDate =
    lastGeneratedAt.startsWith('Not generated')
        ? 'Aucune génération TMDB lancée pour le moment.'
        : new Date(lastGeneratedAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

export function HomeRoute() {
    return (
        <>
            <section className="hero-zone py-5">
                <Container>
                    <Row className="align-items-center g-4">
                        <Col lg={8}>
                            <Badge bg="light" text="dark" className="hero-badge mb-3">
                                Un développeur fan de séries
                            </Badge>
                            <h1 className="hero-title mb-3">Journal de visionnage</h1>
                            <p className="hero-text mb-0">
                                <strong>Loot</strong>flix, c'est mon journal de visionnage de séries. Il rassemble les séries que je regarde dans un même endroit.
                                J'aurai pu passer par un Excel mais étant développeur, j'ai préféré me faire un petit projet pour
                                parcourir les séries que j'ai regardées, les noter et les partager.
                            </p>
                            <p className="hero-text mb-0 mt-3">
                                Les séries que je regarde sont assez atypiques et je n'ai sûrement pas vu vos séries préférées, j'aime bien les séries niches!
                            </p>
                        </Col>
                        <Col lg={4}>
                            <div className="hero-stats p-4">
                                <p className="stats-title mb-1">Visionnages référencés</p>
                                <p className="stats-value mb-3">{mediaCatalog.length} titres</p>
                                <p className="stats-note mb-0">
                                    Mise à jour TMDB : {generatedDate}
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="pt-5">
                <div className="carousel-block mb-5">
                    <Carousel name="Mes séries préférées" items={favoriteItems} sectionIcon="heart-outline" />
                </div>
                <div className="carousel-block mb-5">
                    <Carousel name="Mes derniers visionnages" items={recentItems} sectionIcon="time-outline" />
                </div>

                <div className="carousel-block mb-5">
                    <Carousel name="Séries policières" items={selectFromType('policier')} sectionIcon="shield-checkmark-outline" />
                </div>
                <div className="carousel-block mb-5">
                    <Carousel name="Séries d'espionnage" items={selectFromType('espionnage')} sectionIcon="eye-outline" />
                </div>
                <div className="carousel-block mb-5">
                    <Carousel name="Séries médicales" items={selectFromType('médical')} sectionIcon="medkit-outline" />
                </div>
                <div className="carousel-block mb-5">
                    <Carousel name="Séries de super-héros" items={selectFromType('super-héros')} sectionIcon="sparkles-outline" />
                </div>
                <div className="carousel-block mb-5">
                    <Carousel name="Séries de science-fiction" items={selectFromType('science-fiction')} sectionIcon="planet-outline" />
                </div>
            </Container>
        </>
    )
}