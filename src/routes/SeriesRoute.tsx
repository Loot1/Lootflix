import { useMemo, useState } from 'react'
import { Badge, Button, Card, Container, Table } from 'react-bootstrap'
import { NavLink } from 'react-router'
import { mediaCatalog } from '../data'

type SortKey = 'name' | 'tmdb' | 'personal' | 'seasons' | 'episodes' | 'date' | 'status'

type SortDirection = 'asc' | 'desc'

type SortEntry = { key: SortKey; direction: SortDirection }

function toDateValue(value: string | null): number {
    if (!value) return 0
    const timestamp = Date.parse(value)
    return Number.isNaN(timestamp) ? 0 : timestamp
}

function toFrenchStatus(status: string | null): string {
    if (!status) return 'Inconnu'
    const translations: Record<string, string> = {
        'Returning Series': 'En cours',
        'Ended': 'Terminée',
        'Canceled': 'Annulée',
        'In Production': 'En production',
        'Planned': 'Planifiée',
        'Pilot': 'Pilote',
        'Released': 'Sorti',
        'Post Production': 'Post-production',
        'Rumored': 'Rumeur'
    }
    return translations[status] ?? status
}

function compareBySortKey(left: (typeof mediaCatalog)[number], right: (typeof mediaCatalog)[number], sortKey: SortKey): number {
    if (sortKey === 'name') {
        return left.title.localeCompare(right.title, 'fr')
    }

    if (sortKey === 'tmdb') {
        return left.voteAverage - right.voteAverage
    }

    if (sortKey === 'personal') {
        return (left.note ?? 0) - (right.note ?? 0)
    }

    if (sortKey === 'seasons') {
        return (left.numberOfSeasons ?? 0) - (right.numberOfSeasons ?? 0)
    }

    if (sortKey === 'episodes') {
        return (left.numberOfEpisodes ?? 0) - (right.numberOfEpisodes ?? 0)
    }

    if (sortKey === 'status') {
        return toFrenchStatus(left.status).localeCompare(toFrenchStatus(right.status), 'fr')
    }

    return toDateValue(left.firstReleaseDate) - toDateValue(right.firstReleaseDate)
}

export function SeriesRoute() {
    const [sortStack, setSortStack] = useState<SortEntry[]>([])

    function handleSort(key: SortKey) {
        setSortStack((prev) => {
            const existing = prev.find((entry) => entry.key === key)
            if (!existing) return [...prev, { key, direction: 'asc' }]
            if (existing.direction === 'asc') return prev.map((entry) => entry.key === key ? { key, direction: 'desc' } : entry)
            return prev.filter((entry) => entry.key !== key)
        })
    }

    function SortIcon({ column }: { column: SortKey }) {
        const index = sortStack.findIndex((entry) => entry.key === column)
        if (index === -1) return <ion-icon name="swap-vertical-outline" />
        const entry = sortStack[index]
        const badge = sortStack.length > 1 ? <sup className="sort-badge">{index + 1}</sup> : null
        return <>{entry.direction === 'asc' ? <ion-icon name="chevron-up-outline" /> : <ion-icon name="chevron-down-outline" />}{badge}</>
    }

    function renderPersonalRating(note: number | null) {
        if (note === null) {
            return <span className="text-muted">-</span>
        }

        const normalized = Math.max(0, Math.min(10, note))

        return <span className="personal-rating-score">{normalized.toFixed(1)}</span>
    }

    const filtered = useMemo(() => {
        const matches = mediaCatalog.slice()

        matches.sort((left, right) => {
            for (const entry of sortStack) {
                const compare = compareBySortKey(left, right, entry.key)
                if (compare !== 0) return entry.direction === 'asc' ? compare : -compare
            }
            return 0
        })

        return matches
    }, [sortStack])

    return (
        <Container className="py-5 series-page">
            <div className="series-header mb-4">
                <Badge bg="danger" className="mb-2">Explorateur de visionnage</Badge>
                <h1 className="series-title">Toutes les séries que j'ai regardées</h1>
                <p className="series-subtitle mb-0">
                    Filtre et trie par note TMDB, note perso, saisons, épisodes, date, statut ou nom.
                </p>
            </div>

            <Card className="series-results-card p-0 overflow-hidden">
                <div className="series-results-head px-3 py-2 d-flex justify-content-between align-items-center">
                    <span><strong>{filtered.length}</strong> résultat(s)</span>
                    {sortStack.length > 0 && (
                        <Button variant="outline-secondary" size="sm" onClick={() => setSortStack([])}>
                            <ion-icon name="close-outline" /> Annuler le tri
                        </Button>
                    )}
                </div>
                <Table responsive className="mb-0 series-table" hover>
                    <thead>
                        <tr>
                            <th role="button" onClick={() => handleSort('name')} className="series-th-sortable">Série <SortIcon column="name" /></th>
                            <th role="button" onClick={() => handleSort('date')} className="series-th-sortable">Date <SortIcon column="date" /></th>
                            <th role="button" onClick={() => handleSort('tmdb')} className="series-th-sortable">TMDB <SortIcon column="tmdb" /></th>
                            <th role="button" onClick={() => handleSort('personal')} className="series-th-sortable">Ma note <SortIcon column="personal" /></th>
                            <th role="button" onClick={() => handleSort('seasons')} className="series-th-sortable">Saisons <SortIcon column="seasons" /></th>
                            <th role="button" onClick={() => handleSort('episodes')} className="series-th-sortable">Épisodes <SortIcon column="episodes" /></th>
                            <th role="button" onClick={() => handleSort('status')} className="series-th-sortable">Statut <SortIcon column="status" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((media) => (
                            <tr key={media.slug}>
                                <td>
                                    <NavLink to={`/serie/${media.slug}`} className="series-link">
                                        {media.title}
                                    </NavLink>
                                </td>
                                <td>{media.firstReleaseDate ?? 'N/A'}</td>
                                <td><span className="serie-metadata-score">{media.voteAverage.toFixed(1)}</span></td>
                                <td>{renderPersonalRating(media.note)}</td>
                                <td>{media.numberOfSeasons ?? '-'}</td>
                                <td>{media.numberOfEpisodes ?? '-'}</td>
                                <td>{toFrenchStatus(media.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Container>
    )
}
