"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { Filter, Grid, List, Search } from "lucide-react"

import { useProducts, type ProductWithCategory } from "@/hooks/use-products"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProductSkeleton } from "@/components/product-skeleton"
import { useCart } from "@/components/cart-context"

type ViewMode = "grid" | "list"

type CategoryOption = {
  label: string
  value: string
}

export default function ProductsRoute() {
  return <ProductsPage />
}

export function ProductsPage() {
  const { dispatch } = useCart()
  const { products, categories, loading, error } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showOffers, setShowOffers] = useState(false)

  const categoryOptions: CategoryOption[] = useMemo(
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
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">Catálogo de Productos</h1>
          <p className="text-slate-300 max-w-2xl">
            Explora nuestra selección de componentes electrónicos para tus proyectos. Todos nuestros productos están
            verificados y listos para que lleves tus ideas al siguiente nivel.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 mb-10 shadow-xl shadow-slate-900/40">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Buscar productos por nombre, categoría o descripción..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10 bg-slate-800/70 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
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

        {error ? (
          <Card className="border-red-500/30 bg-red-900/10">
            <CardContent className="py-12 text-center text-red-200">{error}</CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
            {loading
              ? Array.from({ length: viewMode === "grid" ? 6 : 4 }).map((_, index) => (
                  <ProductSkeleton key={`skeleton-${index}`} />
                ))
              : filteredProducts.length > 0
                ? filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className={`bg-slate-900/70 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div className={viewMode === "list" ? "relative h-48 w-48 flex-shrink-0" : "relative h-56"}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        />
                        {product.isOffer && (
                          <Badge className="absolute top-3 right-3 bg-red-600 text-white shadow-lg shadow-red-600/40">
                            Oferta
                          </Badge>
                        )}
                        {!product.inStock && (
                          <Badge className="absolute top-3 left-3 bg-slate-700 text-white">Agotado</Badge>
                        )}
                      </div>

                      <div className="flex-1">
                        <CardHeader className={viewMode === "list" ? "pb-2" : ""}>
                          <CardTitle className="text-xl text-white">{product.name}</CardTitle>
                          <CardDescription className="text-slate-300">{product.description}</CardDescription>
                          {product.category?.name && (
                            <Badge variant="outline" className="w-fit text-blue-400 border-blue-400">
                              {product.category.name}
                            </Badge>
                          )}
                        </CardHeader>

                        <CardContent className={viewMode === "list" ? "pt-0" : ""}>
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
                            {product.inStock ? "Agregar al carrito" : "Agotado"}
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  ))
                : (
                    <div className="col-span-full text-center py-12 bg-slate-900/60 border border-slate-700 rounded-xl">
                      <p className="text-slate-400 text-lg">No se encontraron productos con los filtros seleccionados.</p>
                      <p className="text-sm text-slate-500 mt-2">
                        Ajusta la búsqueda o prueba con otra categoría del catálogo.
                      </p>
                    </div>
                  )}
          </div>
        )}
      </div>
    </div>
  )
}
