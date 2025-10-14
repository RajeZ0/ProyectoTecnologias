"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"
import { useCart } from "./cart-context"

const featuredProducts = [
  {
    id: 1,
    name: "Kit Resistencias Básicas",
    description: "Set de 100 resistencias de diferentes valores (1Ω a 1MΩ)",
    price: 150,
    originalPrice: 200,
    rating: 4.8,
    image: "/electronic-resistors-kit-colorful-components.jpg",
    badge: "Más Vendido",
    badgeColor: "bg-green-600 text-white",
  },
  {
    id: 2,
    name: "Arduino Uno R3 Compatible",
    description: "Microcontrolador compatible con Arduino para proyectos",
    price: 350,
    originalPrice: 450,
    rating: 4.9,
    image: "/arduino-uno-microcontroller-board-blue-electronic.jpg",
    badge: "Oferta",
    badgeColor: "bg-red-600 text-white",
  },
  {
    id: 3,
    name: "Protoboard 830 Puntos",
    description: "Protoboard de alta calidad para prototipos y pruebas",
    price: 80,
    originalPrice: 100,
    rating: 4.7,
    image: "/white-breadboard-protoboard-830-points-electronic-.jpg",
    badge: "Nuevo",
    badgeColor: "bg-blue-600 text-white",
  },
  {
    id: 4,
    name: "Multímetro Digital DT830B",
    description: "Multímetro digital básico para mediciones eléctricas",
    price: 250,
    originalPrice: 300,
    rating: 4.6,
    image: "/digital-multimeter-yellow-black-electronic-measure.jpg",
    badge: "Recomendado",
    badgeColor: "bg-purple-600 text-white",
  },
  {
    id: 5,
    name: "Kit Cables Jumper",
    description: "Set de 120 cables jumper macho-macho, hembra-hembra",
    price: 60,
    originalPrice: 80,
    rating: 4.5,
    image: "/colorful-jumper-wires-cables-electronic-connection.jpg",
    badge: "Básico",
    badgeColor: "bg-slate-600 text-white",
  },
  {
    id: 6,
    name: "Transistores NPN/PNP Kit",
    description: "Surtido de transistores 2N2222, 2N3904, 2N3906",
    price: 120,
    originalPrice: 150,
    rating: 4.8,
    image: "/electronic-transistors-components-black-plastic-to.jpg",
    badge: "Completo",
    badgeColor: "bg-orange-600 text-white",
  },
]

export function FeaturedProducts() {
  const { dispatch } = useCart()

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
    })
  }

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance text-white">Productos Destacados</h2>
          <p className="text-xl text-slate-300 text-pretty max-w-2xl mx-auto">
            Los componentes más populares entre estudiantes de ingeniería
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 border-slate-700/50 overflow-hidden bg-slate-800/50 backdrop-blur-sm"
            >
              <div className="relative h-48">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={product.id === 1}
                />
                <Badge className={`absolute top-3 left-3 ${product.badgeColor}`}>{product.badge}</Badge>
              </div>

              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg line-clamp-1 text-white">{product.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-slate-300">{product.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{product.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-400">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
                  )}
                  {product.originalPrice && (
                    <Badge variant="secondary" className="text-xs">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white group transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Añadir al Carrito
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/productos">
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-blue-600 hover:text-white bg-transparent border-blue-500 text-blue-400"
            >
              Ver Todos los Productos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
