import path from 'node:path'
import process from 'node:process'

export const ROOT = process.cwd()
export const LIBRARY_FILE = path.join(ROOT, 'tmdb.library.json')
export const OUTPUT_FILE = path.join(ROOT, 'src', 'generated', 'tmdb-media.generated.ts')
export const IMAGE_DIR = path.join(ROOT, 'public', 'generated', 'images')

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w780'

export const IMAGE_JPEG_QUALITY = 72
