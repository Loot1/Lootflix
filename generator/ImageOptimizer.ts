import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

export class ImageOptimizer {
    private readonly jpegQuality: number

    constructor(jpegQuality: number) {
        this.jpegQuality = jpegQuality
    }

    async saveOptimizedJpeg(inputBytes: Uint8Array, outputAbsolutePath: string): Promise<void> {
        await mkdir(path.dirname(outputAbsolutePath), { recursive: true })

        try {
            const optimized = await sharp(inputBytes, { failOn: 'none' })
                .jpeg({
                    quality: this.jpegQuality,
                    mozjpeg: true,
                    progressive: true,
                    chromaSubsampling: '4:2:0'
                })
                .toBuffer()

            await writeFile(outputAbsolutePath, optimized)
        } catch (error) {
            console.warn(`[TMDB] Compression image impossible, fallback brut: ${outputAbsolutePath}`, error)
            await writeFile(outputAbsolutePath, inputBytes)
        }
    }
}
