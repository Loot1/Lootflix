import { Container } from 'react-bootstrap'
import { NavLink } from 'react-router'
import tmdbLogo from '../../assets/images/tmdb.svg'

export function Footer() {
    return (
        <footer className="site-footer mt-5">
            <Container className="py-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div className="footer-brand-block">
                        <p className="footer-title mb-1">Lootflix</p>
                        <p className="footer-subtitle mb-0">Journal d'un passioné de séries, réalisé avec 🤍 grâce aux données de TMDB.</p>
                    </div>

                    <div className="d-flex align-items-center gap-3 w-100 w-md-auto justify-content-between justify-content-md-end">
                        <div className="d-flex align-items-center justify-content-start">
                            <NavLink to="/mentions-legales" className="footer-link d-inline-block">
                                Mentions légales
                            </NavLink>
                        </div>

                        <div className="d-flex align-items-center justify-content-end flex-shrink-0 gap-2" aria-label="Liens externes Lootflix">
                            <a
                                href="https://github.com/Loot1/Lootflix"
                                target="_blank"
                                rel="noreferrer"
                                className="github-link d-inline-flex align-items-center justify-content-center p-0 lh-1"
                                aria-label="GitHub Lootflix"
                            >
                                <ion-icon name="logo-github"></ion-icon>
                            </a>

                            <a
                                href="https://www.themoviedb.org/"
                                target="_blank"
                                rel="noreferrer"
                                className="d-inline-flex align-items-center justify-content-center p-0"
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