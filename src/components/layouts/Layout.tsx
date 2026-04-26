import { Header } from '../navigation/Header'
import { Footer } from '../navigation/Footer'
import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-vh-100 d-flex flex-column">
            <Header />
            <main className="flex-grow-1">{children}</main>
            <Footer />
        </div>
    )
}