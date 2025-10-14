"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { Filter, Search, ShoppingCart } from "lucide-react"

import { useProducts, type ProductWithCategory } from "@/hooks/use-products"
import { useCart } from "@/components/cart-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProductSkeleton } from "@/components/product-skeleton"

export function AllProductsSection() {
  const { dispatch } = useCart()
  const { products, categories, loading, error } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [showOffers, setShowOffers] = useState(false)

  const categoryOptions = useMemo(
    () => [
      { label: "Todos", value: "todos" },
      ...categories.map((category) => ({
        label: category.name,
        value: category.slug,
      })),
    ],
    [categories],
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category?.name.toLowerCase().includes(normalizedQuery)

      const matchesCategory =
        selectedCategory === "todos" || product.category?.slug === selectedCategory

      const matchesOffers = !showOffers || product.isOffer

      return matchesSearch && matchesCategory && matchesOffers
    })
  }, [products, searchQuery, selectedCategory, showOffers])

  const addToCart = (product: ProductWithCategory) => {
    if (!product.inStock) return

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
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Todos nuestros productos</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Encuentra el componente perfecto para tu proyecto. Filtra por categoría, busca por nombre o descubre nuestras
            ofertas destacadas.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 mb-12 shadow-xl shadow-slate-900/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10 bg-slate-800/70 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={
                    selectedCategory === category.value
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                  }
                >
                  {category.label}
                </Button>
              ))}
              <Button
                variant={showOffers ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOffers(!showOffers)}
                className={showOffers ? "bg-green-600 hover:bg-green-700" : "border-slate-600 text-slate-300"}
              >
                <Filter className="h-4 w-4 mr-1" />
                Solo ofertas
              </Button>
            </div>
          </div>
        </div>

        {error ? (
          <Card className="border-red-500/30 bg-red-900/10">
            <CardContent className="py-12 text-center text-red-200">{error}</CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={`catalog-skeleton-${index}`} />)
              : filteredProducts.length > 0
                ? filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="bg-slate-800/60 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden"
                    >
                      <div className="relative h-48">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        />
                        {product.isOffer && (
                          <Badge className="absolute top-3 right-3 bg-red-600 text-white shadow shadow-red-600/40">
                            Oferta
                          </Badge>
                        )}
                        {!product.inStock && (
                          <Badge className="absolute top-3 left-3 bg-slate-700 text-white">Agotado</Badge>
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg text-white line-clamp-1">{product.name}</CardTitle>
                        <CardDescription className="text-slate-300 line-clamp-2">{product.description}</CardDescription>
                        {product.category?.name && (
                          <Badge variant="outline" className="w-fit text-blue-400 border-blue-400">
                            {product.category.name}
                          </Badge>
                        )}
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-green-400">${product.price.toFixed(2)}</span>
                          {typeof product.originalPrice === "number" && (
                            <span className="text-lg text-slate-400 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:text-slate-300"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? "Agregar al carrito" : "Agotado"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                : (
                    <div className="col-span-full text-center py-12 bg-slate-900/50 border border-slate-700 rounded-xl">
                      <p className="text-slate-400 text-lg">No encontramos productos con los filtros aplicados.</p>
                      <p className="text-sm text-slate-500 mt-2">
                        Ajusta la búsqueda o revisa otra categoría del catálogo.
                      </p>
                    </div>
                  )}
          </div>
        )}
      </div>
    </section>
  )
}
