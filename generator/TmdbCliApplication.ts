import { MediaType, SectionName } from './types'
import { TmdbStaticGenerator } from './TmdbStaticGenerator'

export class TmdbCliApplication {
    private readonly generator: TmdbStaticGenerator

    constructor(generator: TmdbStaticGenerator) {
        this.generator = generator
    }

    async run(argv: string[]): Promise<void> {
        const [command, ...args] = argv

        if (!command || command === 'help' || command === '--help') {
            this.printHelp()
            return
        }

        if (command === 'update') {
            await this.generator.generateAll()
            return
        }

        if (command === 'add') {
            const options = this.parseAddArgs(args)
            await this.generator.addSingleMedia(options)
            return
        }

        throw new Error(`Commande inconnue: ${command}`)
    }

    private parseAddArgs(args: string[]): {
        title: string
        section: SectionName
        mediaTypePreference: MediaType
        regenerate: boolean
    } {
        let title = ''
        let section: SectionName = 'watchHistory'
        let mediaTypePreference: MediaType = 'tv'
        let regenerate = true

        for (const arg of args) {
            if (arg.startsWith('--title=')) {
                title = arg.slice('--title='.length).trim()
                continue
            }

            if (arg.startsWith('--section=')) {
                const value = arg.slice('--section='.length).trim()
                if (value === 'favorites' || value === 'watchHistory') {
                    section = value
                }
                continue
            }

            if (arg.startsWith('--mediaType=')) {
                const value = arg.slice('--mediaType='.length).trim()
                if (value === 'tv' || value === 'movie') {
                    mediaTypePreference = value
                }
                continue
            }

            if (arg === '--no-update') {
                regenerate = false
                continue
            }

            if (!arg.startsWith('--') && title.length === 0) {
                title = arg.trim()
            }
        }

        if (title.length === 0) {
            throw new Error('Titre manquant. Exemple: npm run tmdb:add -- --title="Dark" --section=favorites')
        }

        return {
            title,
            section,
            mediaTypePreference,
            regenerate
        }
    }

    private printHelp(): void {
        console.log('Usage:')
        console.log('- npm run tmdb:update')
        console.log('- npm run tmdb:add -- --title="Nom de la série" --section=favorites --mediaType=tv')
        console.log('- npm run tmdb:add -- --title="Nom" --no-update')
    }
}
