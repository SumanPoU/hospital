"use client"

import { useEffect, useCallback, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react"
import Link from "next/link"

const BANNER_DATA = [
  {
    image: "/Hero/hospital-bg.jpg",
    title: "Compassionate Hospital Care",
    description: "Providing a safe and welcoming environment for all patients",
    link: "/services",
    linktext: "Explore Services",
  },
  {
    image: "/Hero/doctor.jpg",
    title: "Expert Medical Team",
    description: "Skilled doctors ready to provide personalized treatment",
    link: "/facilities",
    linktext: "Learn More",
  },
  {
    image: "/Hero/hospital-ward.jpg",
    title: "Comfortable Patient Wards",
    description: "Modern and hygienic wards designed for your comfort",
    link: "/wellness",
    linktext: "Discover Programs",
  },
  {
    image: "/Hero/ward_photo.jpg",
    title: "Trusted Healthcare Professionals",
    description: "Dedicated specialists ensuring your speedy recovery",
    link: "/team",
    linktext: "Meet Our Team",
  },
];


export default function Hero() {
  const [api, setApi] = useState(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const scrollNext = useCallback(() => {
    if (api) api.scrollNext()
  }, [api])

  useEffect(() => {
    if (!api || !isPlaying) return
    const interval = setInterval(scrollNext, 5000)
    return () => clearInterval(interval)
  }, [api, isPlaying, scrollNext])

  const toggleAutoplay = () => {
    setIsPlaying((prev) => !prev)
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Carousel className="w-full h-full" opts={{ loop: true, align: "start" }} setApi={setApi}>
        <CarouselContent>
          {BANNER_DATA.map((slide, index) => (
            <CarouselItem key={index} className="relative w-full h-screen">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
                style={{ backgroundImage: `url(${slide.image})` }}
              ></div>
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 lg:px-8">
                  <div className="max-w-md md:max-w-2xl">
                    <div className="relative backdrop-blur-xl  rounded-none p-4 md:p-6 lg:p-8  shadow-2xl">
                      <div className="absolute inset-0  rounded-none pointer-events-none" />
                      <div className="relative z-10">
                        {slide?.title && (
                          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 leading-tight tracking-wide text-white  animate-in slide-in-from-left-8 duration-1000 delay-300">
                            {slide.title}
                          </h1>
                        )}
                        {slide?.description && (
                          <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed opacity-95 text-white/90 font-nunito-sans font-light tracking-wide animate-in slide-in-from-left-8 duration-1000 delay-500">
                            {slide.description}
                          </p>
                        )}
                        {slide.link && slide.linktext && (
                          <div className="animate-in slide-in-from-left-8 duration-1000 delay-700">
                            <Button
                              size="lg"
                              className=" bg-white hover:bg-white/90 text-primary px-8 py-4 md:px-10 md:py-6 text-base md:text-lg font-semibold  shadow-lg hover:shadow-xl transition-all duration-300 transform "
                              asChild
                            >
                              <Link href={slide.link} className="flex items-center gap-2">
                                {slide.linktext}
                                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                      {/* Decorative accent elements */}
                      <div className="absolute -top-3 -left-3 w-6 h-6 bg-white/30 rounded-full blur-md" />
                      <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-white/20 rounded-full blur-md" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <CarouselPrevious className="left-6 lg:left-10 bg-white/15 hover:bg-white/25 border-white/30 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg" />
        <CarouselNext className="right-6 lg:right-10 bg-white/15 hover:bg-white/25 border-white/30 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg" />

        {/* Autoplay Toggle */}
        <button
          onClick={toggleAutoplay}
          className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 bg-white/15 hover:bg-white/25 border border-white/30 text-white backdrop-blur-md rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      </Carousel>
    </section>
  )
}
