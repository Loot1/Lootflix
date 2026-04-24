import { items, test } from '../data.js'
import { Carousel } from '../components/index.js';

export function HomeRoute() {
    return (
        <main>
            <div className="mt-5">
                <Carousel name="Mes séries favorites" items={items}/>
            </div>
            <div className="mt-3">
                <Carousel name="Mes séries fgh" items={test}/>
            </div>
        </main>
    )
}