import defenders from "../assets/img/defenders.jpg"
import frontera from "../assets/img/frontera.jpg"
import irlandes from "../assets/img/irlandes.jpg"
import maldicion from "../assets/img/maldicion.jpg"
import sinner from "../assets/img/sinner.jpg"
import suits from "../assets/img/suits.jpg"
import venom from "../assets/img/venom.jpg"

import '../car.css'

export default function SeriePage() {
    const items = [
        {name:"The sinner", image:sinner},
        {name:"Venom", image:venom},
        {name:"El irlandes", image:irlandes},
        {name:"Suits", image:suits},
        {name:"LA MADICION DE BLY MANOR", image:maldicion},
        {name:"Triple frontera", image:frontera},
        {name:"The sinner", image:sinner},
        {name:"The defenders", image:defenders}
    ]
    return (
        <div id="into" style={{scrollBehavior:"smooth"}}>
            <div class="main">
                <div class="main__section" id="milista">
                    <h1>Mi lista</h1>
                    <div class="main__section__carousel">
                        {
                            items.map((movie) => (
                                <div class="main__section__carousel__card">
                                    <img src={movie.image} alt={"Image de couverture de " + movie.name}/>
                                    <div class="carousel__card__text">
                                        <p>{movie.name}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}