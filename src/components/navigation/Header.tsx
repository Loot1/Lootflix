import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'
import logo from '../../assets/images/lootflix.png'
import { NavLink, useNavigate } from 'react-router'
import { mediaCatalog } from '../../data'

export function Header() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    function normalize(value: string): string {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
    }

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const query = normalize(search)
        if (!query) return

        const direct = mediaCatalog.find((entry) => entry.mediaType === 'tv' && normalize(entry.title) === query)
        const partial = mediaCatalog.find((entry) => entry.mediaType === 'tv' && normalize(entry.title).includes(query))
        const match = direct ?? partial

        if (match) {
            navigate(`/serie/${match.slug}`)
            setSearch('')
        }
    }

    function clearSearch() {
        setSearch('')
    }

    const liveMatches = useMemo(() => {
        const query = normalize(search)
        if (!query) {
            return []
        }

        return mediaCatalog
            .filter((entry) => entry.mediaType === 'tv')
            .filter((entry) => normalize(entry.title).includes(query))
            .slice(0, 6)
    }, [search])

    function navigateToMatch(slug: string) {
        navigate(`/serie/${slug}`)
        setSearch('')
    }

    return (
        <header className="site-header sticky-top">
            <Navbar expand="lg" className="py-3">
                <Container>
                    <NavLink to="/" className="d-flex align-items-center text-decoration-none">
                        <Navbar.Brand>
                            <img
                                src={logo}
                                className="brand-logo"
                                alt="Lootflix logo"
                            />
                        </Navbar.Brand>
                    </NavLink>

                    <Navbar.Toggle aria-controls="main-nav" />
                    <Navbar.Collapse id="main-nav" className="align-items-lg-center">
                        <div className="header-search-wrap px-lg-3">
                            <Form onSubmit={onSubmit} className="header-search-form">
                                <div className="header-search-shell">
                                    <span className="header-search-leading" aria-hidden="true">
                                        <ion-icon name="search-outline"></ion-icon>
                                    </span>
                                    <Form.Control
                                        type="search"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Titres, genres, univers..."
                                        className="header-search-input"
                                        aria-label="Rechercher une série"
                                        onKeyDown={(event) => {
                                            if (event.key === 'Escape' && search) {
                                                clearSearch()
                                            }
                                        }}
                                    />
                                    {search && (
                                        <div className="header-search-actions">
                                            <Button
                                                type="button"
                                                className="header-search-clear"
                                                variant="link"
                                                onClick={clearSearch}
                                                aria-label="Effacer la recherche"
                                            >
                                                <ion-icon name="close"></ion-icon>
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {search && (
                                    <div className="header-search-live-results" role="listbox" aria-label="Suggestions de séries">
                                        {liveMatches.length > 0 ? (
                                            liveMatches.map((entry) => (
                                                <button
                                                    key={entry.slug}
                                                    type="button"
                                                    className="header-search-live-item"
                                                    onClick={() => navigateToMatch(entry.slug)}
                                                >
                                                    <img
                                                        src={entry.posterPath ?? entry.backdropPath ?? logo}
                                                        alt={entry.title}
                                                        className="header-search-live-thumb"
                                                        loading="lazy"
                                                    />
                                                    <span className="header-search-live-content">
                                                        <span className="header-search-live-title">{entry.title}</span>
                                                        <span className="header-search-live-meta">
                                                            {entry.firstReleaseDate ? entry.firstReleaseDate.slice(0, 4) : 'Date inconnue'}
                                                        </span>
                                                    </span>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="header-search-live-empty mb-0">Aucune série trouvée</p>
                                        )}
                                    </div>
                                )}
                            </Form>
                        </div>

                        <Nav className="align-items-lg-center gap-lg-2 ms-lg-auto">
                            <Nav.Link as={NavLink} to="/" end className="menu-link">
                                Accueil
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/series" className="menu-link">
                                Séries
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/film" className="menu-link">
                                Film
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}