import { useRef } from 'react'

import '../assets/style/carousel.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Slider from 'react-slick'
import { NavLink } from 'react-router'
import { Button } from 'react-bootstrap'

type CarouselItem = {
    name: string
    link: string
    image: string
    imageMode: 'poster' | 'backdrop'
}

type CarouselProps = {
    name: string
    items: CarouselItem[]
    sectionIcon?: string
}

export function Carousel({name, items, sectionIcon}: CarouselProps) {
    const sliderRef = useRef<Slider | null>(null)
    const isBackdropCarousel = items.length > 0 && items.every((item) => item.imageMode === 'backdrop')
    const Slick = (Slider as typeof Slider & { default?: typeof Slider }).default ?? Slider

    const settings = {
        slidesToShow: isBackdropCarousel ? 4 : 6,
        slidesToScroll: isBackdropCarousel ? 4 : 6,
        speed: 500,
        infinite: false,
        swipeToSlide: true,
        lazyLoad: 'ondemand' as const,
        arrows: false,
        responsive: [
            {
                breakpoint: 3100,
                settings: {
                    slidesToShow: isBackdropCarousel ? 4 : 6,
                    slidesToScroll: isBackdropCarousel ? 4 : 6
                }
            },
            {
                breakpoint: 2500,
                settings: {
                    slidesToShow: isBackdropCarousel ? 4 : 5,
                    slidesToScroll: isBackdropCarousel ? 4 : 5
                }
            },
            {
                breakpoint: 1800,
                settings: {
                    slidesToShow: isBackdropCarousel ? 3 : 4,
                    slidesToScroll: isBackdropCarousel ? 3 : 4
                }
            },
            {
                breakpoint: 1420,
                settings: {
                    slidesToShow: isBackdropCarousel ? 2 : 3,
                    slidesToScroll: isBackdropCarousel ? 2 : 3
                }
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
        <section className="carousel-wrapper">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-3 px-1">
                <h2 className="py-0 my-0 carousel-title">
                    <ion-icon name={sectionIcon} className="carousel-section-icon" aria-hidden="true"></ion-icon>
                    <span>{name}</span>
                </h2>
                <div className="d-flex gap-2 carousel-arrows-wrap">
                    <Button variant="outline-danger" size="sm" className="carousel-arrow" onClick={() => sliderRef.current?.slickPrev()} aria-label="Carrousel precedent">
                        <ion-icon name="caret-back-outline"></ion-icon>
                    </Button>
                    <Button variant="outline-danger" size="sm" className="carousel-arrow" onClick={() => sliderRef.current?.slickNext()} aria-label="Carrousel suivant">
                        <ion-icon name="caret-forward-outline"></ion-icon>
                    </Button>
                </div>
            </div>
            <Slick {...settings} ref={sliderRef} className="carousel-section">
                {
                    items.map((serie) => (
                        <NavLink to={serie.link} className={`carousel-card carousel-card--${serie.imageMode}`} key={serie.link}>
                            <img
                                src={serie.image}
                                alt={"Image de couverture de " + serie.name}
                                className={`carousel-image carousel-image--${serie.imageMode}`}
                            />
                            <div className="carousel-text">
                                <p>
                                    <span>{serie.name}</span>
                                </p>
                            </div>
                        </NavLink>
                    ))
                }
            </Slick>
        </section>
    )
}