import { useState } from 'react';

import '../assets/style/carousel.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import { NavLink } from 'react-router';

type CarouselItem = {
    name: string
    link: string
    image: string
}

type CarouselProps = {
    name: string
    items: CarouselItem[]
}

export function Carousel({name,items}: CarouselProps) {
    const [slider, setSlider] = useState<Slider | null>(null)
    const Slick = (Slider as any).default ?? Slider
    const settings = {
        slidesToShow: 6,
        slidesToScroll: 6,
        speed: 500,
        infinite: false,
        swipeToSlide: true,
        lazyLoad: "ondemand",
        arrows: false,
        responsive: [
            {
                breakpoint: 3100,
                settings: { slidesToShow: 6, slidesToScroll: 6 }
            },
            {
                breakpoint: 2500,
                settings: { slidesToShow: 5, slidesToScroll: 5 }
            },
            {
                breakpoint: 1800,
                settings: { slidesToShow: 4, slidesToScroll: 4 }
            },
            {
                breakpoint: 1420,
                settings: { slidesToShow: 3, slidesToScroll: 3 }
            },
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2, slidesToScroll: 2 }
            },
            {
                breakpoint: 700,
                settings: { slidesToShow: 1, slidesToScroll: 1 }
            }
        ]
    }
    return (
        <div>
            <div className="d-flex">
                <h2 className="py-0 my-0 carousel-title">{name}</h2>
                <ion-icon name="caret-back-outline" size="large" style={{color: "#E50914", cursor: "pointer"}} onClick={() => slider?.slickPrev()}></ion-icon>
                <ion-icon name="caret-forward-outline" size="large" style={{color: "#E50914", cursor: "pointer"}} onClick={() => slider?.slickNext()}></ion-icon>
            </div>
            <Slick {...settings} ref={(that: Slider | null) => (setSlider(that))} className="carousel-section">
                {
                    items.map((serie) => (
                        <NavLink to={serie.link} className="carousel-card" key={serie.link} style={{}}>
                            <img
                                src={serie.image}
                                alt={"Image de couverture de " + serie.name}
                                style={{maxHeight:"192px", maxWidth:"392px", objectFit:"cover"}}
                            />
                            <div className="carousel-text">
                                <p>{serie.name}</p>
                            </div>
                            {/* TODO : check statut */}
                        </NavLink>
                    ))
                }
            </Slick>
        </div>
    )
}