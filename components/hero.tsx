"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight, Cpu, Zap, Shield, Truck } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Circuit board pattern with interactive nodes
    const nodes: Array<{ x: number; y: number; size: number; pulse: number; connected: boolean }> = []
    const connections: Array<{ from: number; to: number; strength: number }> = []

    // Initialize nodes
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 3 + 1,
        pulse: Math.random() * Math.PI * 2,
        connected: false,
      })
    }

    // Create connections
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const distance = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2))
          if (distance < 150 && Math.random() > 0.7) {
            connections.push({ from: i, to: j, strength: 1 - distance / 150 })
          }
        }
      })
    })

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Update mouse influence
      nodes.forEach((node) => {
        const mouseDistance = Math.sqrt(Math.pow(node.x - mousePosition.x, 2) + Math.pow(node.y - mousePosition.y, 2))
        node.connected = mouseDistance < 200
        node.pulse += 0.05
      })

      // Draw connections
      connections.forEach((connection) => {
        const fromNode = nodes[connection.from]
        const toNode = nodes[connection.to]

        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)

        const alpha = connection.strength * 0.3 * (fromNode.connected || toNode.connected ? 1 : 0.3)
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Draw nodes
      nodes.forEach((node) => {
        const pulseSize = node.size + Math.sin(node.pulse) * 0.5
        const alpha = node.connected ? 1 : 0.6

        // Outer glow
        if (node.connected) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, pulseSize * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(34, 197, 94, 0.1)`
          ctx.fill()
        }

        // Main node
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = node.connected ? `rgba(34, 197, 94, ${alpha})` : `rgba(59, 130, 246, ${alpha})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const scrollToProducts = () => {
    const productsSection = document.getElementById("productos")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById("contacto")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section
      id="inicio"
      className="relative overflow-hidden min-h-screen flex items-center bg-slate-900"
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
      />

      {/* Dark overlay to ensure text contrast */}
      <div className="absolute inset-0 bg-slate-900/60"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-secondary/20 rotate-12 animate-pulse"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 border border-accent/20 -rotate-12 animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-primary/30 rotate-45 animate-spin-reverse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content with improved contrast */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/90 border border-blue-400/50 text-white text-sm font-medium backdrop-blur-sm">
                <Cpu className="w-4 h-4 mr-2" />
                UAEMEX Ingeniería
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-balance leading-tight">
                <span className="text-white drop-shadow-lg">Electrónicos</span>
                <br />
                <span className="text-white drop-shadow-lg bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent supports-[not(background-clip:text)]:text-blue-400">
                  del Futuro
                </span>
              </h1>

              <p className="text-xl text-slate-200 text-pretty max-w-lg leading-relaxed drop-shadow-md">
                Componentes de vanguardia para proyectos de ingeniería. Innovación, precisión y confiabilidad en cada
                producto.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white group px-8 py-4 text-lg shadow-lg"
                onClick={scrollToProducts}
              >
                Explorar Catálogo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/50 text-primary hover:bg-primary/20 px-8 py-4 text-lg bg-slate-800/50 backdrop-blur-sm"
                onClick={scrollToContact}
              >
                Contactar Experto
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
              <div className="group cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg drop-shadow-md">Innovación</h3>
                    <p className="text-slate-300 text-sm">Tecnología de punta</p>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg drop-shadow-md">Confiabilidad</h3>
                    <p className="text-slate-300 text-sm">Garantía extendida</p>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/30 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                    <Truck className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg drop-shadow-md">Precisión</h3>
                    <p className="text-slate-300 text-sm">Entrega inmediata</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D-style visual element */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Main holographic display */}
              <div className="relative w-96 h-96 mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-xl border border-primary/20 animate-pulse-glow">
                  <div className="absolute inset-4 rounded-2xl border border-secondary/30 flex items-center justify-center">
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1 animate-spin-slow">
                          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                            <Cpu className="w-16 h-16 text-primary animate-pulse" />
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary animate-ping"></div>
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-accent animate-pulse delay-500"></div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-white drop-shadow-lg">ElectroUAEMEX</h3>
                        <p className="text-slate-300 text-lg">Sistema Avanzado</p>
                        <div className="flex justify-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-200"></div>
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-4 h-4 rounded-full bg-primary"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 w-4 h-4 rounded-full bg-secondary"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-4 h-4 rounded-full bg-accent"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-4 h-4 rounded-full bg-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
