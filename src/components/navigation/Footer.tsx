import { Container } from 'react-bootstrap'
import { NavLink } from 'react-router'
import tmdbLogo from '../../assets/images/tmdb.svg'

export function Footer() {
    return (
        <footer className="site-footer mt-5">
            <Container className="py-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 footer-layout">
                    <div className="footer-brand-block">
                        <p className="footer-title mb-1">Lootflix</p>
                        <p className="footer-subtitle mb-0">Journal d'un passioné de séries, réalisé avec 🤍 grâce aux données de TMDB.</p>
                    </div>

                    <div className="footer-meta-row">
                        <div className="footer-legal-block">
                            <NavLink to="/mentions-legales" className="footer-link d-inline-block">
                                Mentions légales
                            </NavLink>
                        </div>

                        <div className="footer-badges" aria-label="Liens externes Lootflix">
                            <a
                                href="https://github.com/Loot1/Lootflix"
                                target="_blank"
                                rel="noreferrer"
                                className="github-link footer-github-link"
                                aria-label="GitHub Lootflix"
                            >
                                <ion-icon name="logo-github"></ion-icon>
                            </a>

                            <a
                                href="https://www.themoviedb.org/"
                                target="_blank"
                                rel="noreferrer"
                                className="tmdb-badge"
                                aria-label="The Movie Database"
                            >
                                <img src={tmdbLogo} alt="TMDB" className="tmdb-logo" />
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    )
}