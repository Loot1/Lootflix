import { Container } from 'react-bootstrap'

export function LegalRoute() {
    return (
        <Container className="legal-page py-5">
            <h1 className="legal-title mb-4">Mentions légales</h1>

            <section className="legal-section mb-4">
                <h2>Éditeur du site</h2>
                <p>
                    Le site Lootflix est un projet personnel qui recense les séries regardées par un
                    passionné de séries, dans une logique de journal de visionnage.
                </p>
            </section>

            <section className="legal-section mb-4">
                <h2>Propriété intellectuelle</h2>
                <p>
                    Les visuels et titres utilisés restent la propriété de leurs ayants droit respectifs.
                    Ils sont affichés uniquement pour identifier les séries mentionnées.
                </p>
                <p className="mt-3">
                    Les données présentes sur le site sont issues de la base de données The Movie Database (TMDB) et sont utilisées conformément à leurs conditions d'utilisation.
                </p>
            </section>

            <section className="legal-section mb-4">
                <h2>Données personnelles</h2>
                <p>
                    Ce site ne collecte pas de données personnelles et ne met pas en
                    place de compte utilisateur.
                </p>
            </section>

            <section className="legal-section">
                <h2>Contact</h2>
                <p>
                    Pour toute demande, suggestion de série ou correction, veuillez utiliser le dépôt
                    GitHub du projet Lootflix.
                </p>
            </section>
        </Container>
    )
}
