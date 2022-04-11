import { NavLink } from 'react-router-dom'
import { items } from '../data.js'
import '../assets/style/carousel.css'

export default function HomePage() {
    return (
        <div id="into" style={{scrollBehavior:"smooth"}}>
            <div className="main-section mt-5">
                <h2 className="p-0 my-0">Mes séries favorites</h2>
                <div className="main-section-carousel">
                    {
                        items.map((movie) => (
                            <NavLink to={movie.link} className="main-section-carousel-card" key={movie.link}>
                                <img src={movie.image} alt={"Image de couverture de " + movie.name}/>
                                <div className="carousel-card-text">
                                    <p>{movie.name}</p>
                                </div>
                            </NavLink>
                        ))
                    }
                </div>
            </div>
            <div className="main-section mt-4">
                <h2 className="p-0 my-0">Mes séries favorites</h2>
                <div className="main-section-carousel">
                    {
                        items.map((movie) => (
                            <NavLink to={movie.link} className="main-section-carousel-card" key={movie.link}>
                                <img src={movie.image} alt={"Image de couverture de " + movie.name}/>
                                <div className="carousel-card-text">
                                    <p>{movie.name}</p>
                                </div>
                            </NavLink>
                        ))
                    }
                </div>
            </div>
            <div className="main-section mt-4">
                <h2 className="p-0 my-0">Mes séries favorites</h2>
                <div className="main-section-carousel">
                    {
                        items.map((movie) => (
                            <NavLink to={movie.link} className="main-section-carousel-card" key={movie.link}>
                                <img src={movie.image} alt={"Image de couverture de " + movie.name}/>
                                <div className="carousel-card-text">
                                    <p>{movie.name}</p>
                                </div>
                            </NavLink>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}