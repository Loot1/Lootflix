import { config as loadEnv } from 'dotenv'
import process from 'node:process'
import { buildTmdbCliApplication } from './generator/bootstrap'

loadEnv()

async function main(): Promise<void> {
    const app = buildTmdbCliApplication()
    await app.run(process.argv.slice(2))
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
