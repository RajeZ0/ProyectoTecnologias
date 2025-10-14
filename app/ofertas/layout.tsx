import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ofertas | ElectroUAEMEX",
  description: "Descubre promociones en componentes electrónicos para estudiantes de la UAEMEX.",
}

export default function OffersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
