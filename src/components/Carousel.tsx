import { useMemo, useRef } from 'react'

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

type SlideValues = {
    slidesToShow: number
    slidesToScroll: number
}

type SlideRule = {
    breakpoint: number
    poster: SlideValues
    backdrop: SlideValues
}

const SLIDE_RULES: SlideRule[] = [
    {
        breakpoint: 480,
        poster: { slidesToShow: 2, slidesToScroll: 2 },
        backdrop: { slidesToShow: 2, slidesToScroll: 2 }
    },
    {
        breakpoint: 1024,
        poster: { slidesToShow: 3, slidesToScroll: 3 },
        backdrop: { slidesToShow: 3, slidesToScroll: 3 }
    },
    {
        breakpoint: 1800,
        poster: { slidesToShow: 4, slidesToScroll: 4 },
        backdrop: { slidesToShow: 4, slidesToScroll: 4 }
    },
    {
        breakpoint: 2500,
        poster: { slidesToShow: 5, slidesToScroll: 5 },
        backdrop: { slidesToShow: 4, slidesToScroll: 4 }
    }
]

const BASE_SLIDES = {
    poster: { slidesToShow: 6, slidesToScroll: 6 },
    backdrop: { slidesToShow: 4, slidesToScroll: 4 }
}

function selectSlideValues(entry: { poster: SlideValues; backdrop: SlideValues }, isBackdropCarousel: boolean): SlideValues {
    return isBackdropCarousel ? entry.backdrop : entry.poster
}

function getViewportWidth() {
    return typeof window === 'undefined' ? 1920 : window.innerWidth
}

function getSlidesConfig(viewportWidth: number, isBackdropCarousel: boolean) {
    const matchingRule = SLIDE_RULES.find((rule) => viewportWidth <= rule.breakpoint)
    if (matchingRule) {
        return selectSlideValues(matchingRule, isBackdropCarousel)
    }

    return selectSlideValues(BASE_SLIDES, isBackdropCarousel)
}

export function Carousel({name, items, sectionIcon}: CarouselProps) {
    const sliderRef = useRef<Slider | null>(null)
    const isBackdropCarousel = items.length > 0 && items.every((item) => item.imageMode === 'backdrop')
    const Slick = (Slider as typeof Slider & { default?: typeof Slider }).default ?? Slider
    const slidesConfig = useMemo(() => getSlidesConfig(getViewportWidth(), isBackdropCarousel), [isBackdropCarousel])
    const responsiveSettings = useMemo(() => (
        SLIDE_RULES.map((rule) => ({
            breakpoint: rule.breakpoint,
            settings: selectSlideValues(rule, isBackdropCarousel)
        }))
    ), [isBackdropCarousel])

    const settings = {
        slidesToShow: slidesConfig.slidesToShow,
        slidesToScroll: slidesConfig.slidesToScroll,
        speed: 500,
        infinite: false,
        swipeToSlide: true,
        lazyLoad: 'ondemand' as const,
        arrows: false,
        responsive: responsiveSettings
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