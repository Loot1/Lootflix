import { Badge, Card, Container } from 'react-bootstrap'

export function FilmRoute() {
    return (
        <Container className="py-5 film-page">
            <Card className="film-troll-card p-4 p-lg-5 text-center">
                <Badge bg="danger" className="mb-3 align-self-center">Page film</Badge>
                <h1 className="film-title mb-3">Pourquoi il n'y a pas de films ici ?</h1>
                <p className="film-text mb-2">
                    Parce que je n'aime pas trop les films: je trouve souvent que ça manque de suite.
                </p>
                <p className="film-text mb-0">
                    J'adore pouvoir passer longtemps avec les personnages, suivre leur évolution et
                    laisser l'histoire respirer sur plusieurs saisons. C'est pour ça que je préfère les séries, même si j'aime aussi certains films de temps en temps.
                </p>
            </Card>
        </Container>
    )
}
