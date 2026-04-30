export function toFrenchStatus(status: string | null): string {
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