"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Image from "next/image"

interface SearchResult {
  id: number
  name: string
  price: number
  category: string
  image: string
}

interface SearchDropdownProps {
  isOpen: boolean
  query: string
  onClose: () => void
}

const mockProducts: SearchResult[] = [
  {
    id: 1,
    name: "Resistencias 1/4W Kit",
    price: 45.99,
    category: "Componentes Pasivos",
    image: "/electronic-resistors-kit-colorful-components.jpg",
  },
  {
    id: 2,
    name: "Arduino Uno R3",
    price: 299.99,
    category: "Componentes Activos",
    image: "/arduino-uno-microcontroller-board-blue-electronic.jpg",
  },
  {
    id: 3,
    name: "Protoboard 830 puntos",
    price: 89.99,
    category: "Accesorios",
    image: "/white-breadboard-protoboard-830-points-electronic-.jpg",
  },
  {
    id: 4,
    name: "Multímetro Digital",
    price: 199.99,
    category: "Instrumentación",
    image: "/digital-multimeter-yellow-black-electronic-measure.jpg",
  },
  {
    id: 5,
    name: "Cables Jumper",
    price: 25.99,
    category: "Accesorios",
    image: "/colorful-jumper-wires-cables-electronic-connection.jpg",
  },
  {
    id: 6,
    name: "Transistores NPN/PNP",
    price: 35.99,
    category: "Componentes Activos",
    image: "/electronic-transistors-components-black-plastic-to.jpg",
  },
]

export function SearchDropdown({ isOpen, query, onClose }: SearchDropdownProps) {
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered.slice(0, 5))
    } else {
      setResults([])
    }
  }, [query])

  if (!isOpen || query.length === 0) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-transparent z-40" onClick={onClose} />

      {/* Search Results Dropdown */}
      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden">
        {results.length > 0 ? (
          <div className="p-2">
            <div className="text-xs text-slate-400 px-3 py-2 border-b border-slate-700/30">
              {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
            </div>
            {results.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors"
                onClick={() => {
                  // Scroll to product or navigate
                  onClose()
                }}
              >
                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-slate-700">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
                  <p className="text-xs text-slate-400">{product.category}</p>
                </div>

                <div className="text-sm font-semibold text-blue-400">${product.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <Search className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No se encontraron productos</p>
            <p className="text-slate-500 text-xs mt-1">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>
    </>
  )
}
