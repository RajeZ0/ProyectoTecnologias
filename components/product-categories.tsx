import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Cpu, Battery, Zap, Settings, Wrench, ArrowRight } from "lucide-react"

const categories = [
  {
    id: "pasivos",
    title: "Componentes Pasivos",
    description: "Resistencias, condensadores, inductores y potenciómetros",
    icon: Settings,
    image: "/electronic-resistors-capacitors-components.jpg",
    items: [
      "Resistencias (varios valores)",
      "Condensadores cerámicos",
      "Condensadores electrolíticos",
      "Potenciómetros",
    ],
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    id: "activos",
    title: "Componentes Activos",
    description: "Diodos, transistores y circuitos integrados",
    icon: Cpu,
    image: "/electronic-transistors-diodes-integrated-circuits.jpg",
    items: [
      "Diodos LED y rectificadores",
      "Transistores BJT y MOSFET",
      "Circuitos integrados",
      "Reguladores de voltaje",
    ],
    color: "bg-green-500/20 text-green-400",
  },
  {
    id: "energia",
    title: "Fuentes de Energía",
    description: "Baterías, fuentes regulables y conexiones",
    icon: Battery,
    image: "/batteries-power-supplies-breadboard-electronic.jpg",
    items: ["Baterías y portabaterías", "Fuente de poder regulable", "Protoboard", "Cables jumper"],
    color: "bg-yellow-500/20 text-yellow-400",
  },
  {
    id: "instrumentacion",
    title: "Instrumentación",
    description: "Equipos de medición y análisis",
    icon: Zap,
    image: "/multimeter-oscilloscope-electronic-measurement-too.jpg",
    items: ["Multímetro digital", "Osciloscopio", "Generador de funciones", "Analizador de espectro"],
    color: "bg-purple-500/20 text-purple-400",
  },
  {
    id: "accesorios",
    title: "Accesorios",
    description: "Herramientas y componentes auxiliares",
    icon: Wrench,
    image: "/electronic-tools-switches-displays-connectors.jpg",
    items: ["Interruptores y relés", "Displays LCD y 7 segmentos", "Zumbadores y conectores", "Cautín y pinzas"],
    color: "bg-slate-500/20 text-slate-400",
  },
]

export function ProductCategories() {
  return (
    <section id="productos" className="py-20 relative">
      <div className="absolute inset-0 bg-slate-800/30 backdrop-blur-sm"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance text-white">Categorías de Productos</h2>
          <p className="text-xl text-slate-300 text-pretty max-w-2xl mx-auto">
            Encuentra todos los componentes que necesitas organizados por categorías
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className="group hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 border-slate-700/50 overflow-hidden bg-slate-800/50 backdrop-blur-sm"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div
                    className={`absolute bottom-4 left-4 h-12 w-12 rounded-lg ${category.color} flex items-center justify-center backdrop-blur-sm`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>

                <CardHeader className="space-y-4">
                  <div>
                    <CardTitle className="text-xl mb-2 text-white">{category.title}</CardTitle>
                    <p className="text-slate-400 text-sm">{category.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {category.items.map((item, index) => (
                      <li key={index} className="text-sm text-slate-300 flex items-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-3 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/productos">
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-500/30 text-blue-400 hover:bg-blue-600"
                    >
                      Ver Productos
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
