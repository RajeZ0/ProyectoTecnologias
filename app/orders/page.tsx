"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, DollarSign, Package, Truck } from "lucide-react"

import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
  subtotal: number
}

interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  itemCount: number
  status: string
  shippingMinDays: number
  shippingMaxDays: number
  estimatedDelivery: string
  createdAt: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!user?.email) {
      setOrders([])
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const loadOrders = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`, {
          method: "GET",
          signal: controller.signal,
        })

        const payload = (await response.json().catch(() => null)) as { orders?: Order[]; error?: string } | null

        if (!response.ok || !payload) {
          throw new Error(payload?.error ?? "No fue posible recuperar tus pedidos.")
        }

        setOrders(payload.orders ?? [])
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }

        console.error("Failed to fetch orders", fetchError)
        const message =
          fetchError instanceof Error ? fetchError.message : "No fue posible recuperar tus pedidos en este momento."
        setError(message)
        setOrders([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      controller.abort()
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mis Pedidos</h1>
          <p className="text-slate-400">Historial de tus compras</p>
        </div>

        {loading ? (
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="py-12 text-center text-slate-400">Cargando pedidos...</CardContent>
          </Card>
        ) : error ? (
          <Card className="border-red-500/40 bg-red-900/20 backdrop-blur-sm">
            <CardContent className="py-12 text-center text-red-200">{error}</CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No tienes pedidos aún</h3>
              <p className="text-slate-400 mb-6">Comienza a comprar para ver tu historial aquí</p>
              <Link href="/productos">
                <Button className="bg-blue-600 hover:bg-blue-500">Ver Productos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Pedido #{order.orderNumber}</CardTitle>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span>
                      Entrega estimada: {order.shippingMinDays} - {order.shippingMaxDays} días ·{" "}
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-slate-300">
                          {item.productName} x{item.quantity}
                        </span>
                        <span className="text-blue-400 font-semibold">${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-400">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">Total:</span>
                    </div>
                    <span className="text-xl font-bold text-green-400">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Artículos: {order.itemCount}</span>
                    <span className="text-slate-400 uppercase tracking-wide">{order.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
