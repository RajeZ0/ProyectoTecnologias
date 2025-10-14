import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Productos | ElectroUAEMEX",
  description: "Catálogo de componentes básicos y herramientas para cursos de ingeniería UAEMEX.",
}

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
