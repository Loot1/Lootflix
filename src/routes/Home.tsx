import React from 'react';
import Carousel from '../components/Carousel.js'
import { items, test } from '../data.js'

export default function HomePage() {
    return (
        <main>
            <div className="mt-5">
                <Carousel name="Mes séries favorites" items={items}/>
            </div>
            <div className="mt-3">
                <Carousel name="Mes séries fgh" items={items.filter(serie => serie.name === "Suits")}/>
            </div>
        </main>
    )
}