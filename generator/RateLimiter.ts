export class RateLimiter {
    private readonly minIntervalMs: number
    private nextAllowedRequestAt = 0

    constructor(minIntervalMs: number) {
        this.minIntervalMs = minIntervalMs
    }

    async waitTurn(): Promise<void> {
        const now = Date.now()
        const waitMs = Math.max(0, this.nextAllowedRequestAt - now)
        if (waitMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, waitMs))
        }

        this.nextAllowedRequestAt = Date.now() + this.minIntervalMs
    }
}
