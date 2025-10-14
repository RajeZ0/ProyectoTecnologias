"use client"

import Image from "next/image"
import { useMemo } from "react"
import { Percent, ShoppingCart } from "lucide-react"

import { useProducts } from "@/hooks/use-products"
import { useCart } from "@/components/cart-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductSkeleton } from "@/components/product-skeleton"

export function OffersPage() {
  const { dispatch } = useCart()
  const { products, loading, error } = useProducts({ offersOnly: true })

  const [featuredOffer, ...otherOffers] = useMemo(() => products, [products])

  const addToCart = (product: typeof products[number]) => {
    if (!product?.inStock) return

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

  const getDiscount = (price: number, originalPrice?: number | null) => {
    if (!originalPrice || originalPrice <= price) return null
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Percent className="h-10 w-10 text-red-500" />
            Ofertas Especiales
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Descubre descuentos por tiempo limitado en los productos más buscados del catálogo.
          </p>
        </div>

        {error ? (
          <Card className="border-red-500/30 bg-red-900/10 mb-12">
            <CardContent className="py-12 text-center text-red-200">{error}</CardContent>
          </Card>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={`offer-skeleton-${index}`} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="py-12 text-center text-slate-300">
              No hay ofertas activas en este momento. Vuelve pronto para descubrir nuevas promociones.
            </CardContent>
          </Card>
        ) : (
          <>
            {featuredOffer && (
              <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30 overflow-hidden mb-12">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2">
                    <Image
                      src={featuredOffer.image || "/placeholder.svg"}
                      alt={featuredOffer.name}
                      width={800}
                      height={600}
                      className="w-full h-64 lg:h-full object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center space-y-6">
                    <Badge className="w-fit bg-red-600 text-white text-lg px-4 py-2">
                      Oferta destacada
                    </Badge>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{featuredOffer.name}</h2>
                      <p className="text-slate-300">{featuredOffer.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-bold text-green-400">${featuredOffer.price.toFixed(2)}</span>
                      {typeof featuredOffer.originalPrice === "number" && (
                        <span className="text-2xl text-slate-400 line-through">
                          ${featuredOffer.originalPrice.toFixed(2)}
                        </span>
                      )}
                      {getDiscount(featuredOffer.price, featuredOffer.originalPrice) && (
                        <Badge className="bg-red-600 text-white">
                          -{getDiscount(featuredOffer.price, featuredOffer.originalPrice)}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="border-green-500 text-green-300">
                        {featuredOffer.inStock ? "Disponible" : "Agotado"}
                      </Badge>
                      {featuredOffer.category?.name && (
                        <Badge variant="outline" className="border-blue-500 text-blue-300">
                          {featuredOffer.category.name}
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => addToCart(featuredOffer)}
                      disabled={!featuredOffer.inStock}
                      className="bg-red-600 hover:bg-red-700 text-white text-lg py-6"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {featuredOffer.inStock ? "Agregar al carrito" : "Agotado"}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {otherOffers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherOffers.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-slate-800/50 border border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group"
                  >
                    <div className="relative h-48">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      />
                      <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                        -{getDiscount(product.price, product.originalPrice) ?? 0}%
                      </Badge>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-slate-300 line-clamp-2">{product.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-green-400">${product.price.toFixed(2)}</span>
                        {typeof product.originalPrice === "number" && (
                          <span className="text-lg text-slate-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-300 border-green-500/40">
                        {product.inStock ? "Disponible" : "Agotado"}
                      </Badge>
                    </CardContent>

                    <CardFooter>
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        {product.inStock ? "Aprovechar oferta" : "Agotado"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
