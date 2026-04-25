import { Container } from 'react-bootstrap'
import { NavLink } from 'react-router'

export function NoMatchRoute() {
    return (
        <Container className="not-found-page py-5 d-flex align-items-center">
            <section className="not-found-card w-100">
                <p className="not-found-code mb-2">Erreur 404</p>
                <h1 className="not-found-title mb-3">Cette page n'existe pas</h1>
                <p className="not-found-text mb-4">
                    Le contenu que vous cherchez a peut-être été déplacé ou le lien est invalide.
                </p>
                <NavLink to="/" className="btn btn-danger">
                    Retour à l'accueil
                </NavLink>
            </section>
        </Container>
    )
}