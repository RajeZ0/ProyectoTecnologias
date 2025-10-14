"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Zap, Gift, TrendingUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const promotions = [
  {
    id: 1,
    title: "¡Mega Oferta en Arduino!",
    description: "Hasta 30% de descuento en kits de desarrollo",
    image: "/arduino-uno-r3.png",
    icon: Zap,
    color: "from-slate-800 to-slate-900",
    badge: "Oferta Limitada",
  },
  {
    id: 2,
    title: "Kit Completo de Herramientas",
    description: "Todo lo que necesitas para tus proyectos",
    image: "/kit-herramientas-electronicas.png",
    icon: Gift,
    color: "from-slate-800 to-slate-900",
    badge: "Nuevo",
  },
  {
    id: 3,
    title: "Multímetros Profesionales",
    description: "Precisión garantizada para tus mediciones",
    image: "/multimetro-digital-fluke.png",
    icon: TrendingUp,
    color: "from-slate-800 to-slate-900",
    badge: "Más Vendido",
  },
  {
    id: 4,
    title: "Componentes Premium",
    description: "Calidad superior para proyectos exigentes",
    image: "/circuitos-integrados-74hc.png",
    icon: Star,
    color: "from-slate-800 to-slate-900",
    badge: "Destacado",
  },
]

export function PromotionalBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const scrollToProducts = () => {
    const productsSection = document.getElementById("productos")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const currentPromo = promotions[currentSlide]
  const Icon = currentPromo.icon

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
      {/* Main Banner */}
      <div className="relative h-80 md:h-96">
        <div className={`absolute inset-0 bg-gradient-to-r ${currentPromo.color}`}></div>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-green-600/20"></div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] bg-repeat animate-slide"></div>
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-8 flex items-center">
          <div className="grid md:grid-cols-2 gap-8 items-center w-full">
            {/* Text Content */}
            <div className="space-y-6 text-white z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full border border-blue-500/30">
                <Icon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300">{currentPromo.badge}</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in">{currentPromo.title}</h2>

              <p className="text-xl text-slate-300 animate-fade-in-delay">{currentPromo.description}</p>

              <Button
                onClick={scrollToProducts}
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8 py-6 text-lg shadow-xl hover:scale-105 transition-transform duration-300"
              >
                Ver Ofertas
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Image */}
            <div className="relative h-64 md:h-80 animate-float">
              <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-600 shadow-2xl overflow-hidden">
                <Image
                  src={currentPromo.image || "/placeholder.svg"}
                  alt={currentPromo.title}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-75 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 text-white border border-slate-600 h-12 w-12 rounded-full z-20"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 text-white border border-slate-600 h-12 w-12 rounded-full z-20"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-8 bg-blue-500" : "w-2 bg-slate-500 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
