"use client"

import { useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { PromotionalBanner } from "@/components/promotional-banner"
import { AllProductsSection } from "@/components/all-products-section"
import { Footer } from "@/components/footer"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Circuit nodes
    const nodes: Array<{ x: number; y: number; connections: number[] }> = []
    const nodeCount = Math.floor((canvas.width * canvas.height) / 15000)

    // Generate nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: [],
      })
    }

    // Connect nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const distance = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2))
          if (distance < 150 && node.connections.length < 3) {
            node.connections.push(j)
          }
        }
      })
    })

    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY + window.scrollY
    }

    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      nodes.forEach((node) => {
        node.connections.forEach((connectionIndex) => {
          const connectedNode = nodes[connectionIndex]
          const distance = Math.sqrt(Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2))

          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)

          if (distance < 100) {
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.8 - distance / 100})`
            ctx.lineWidth = 2
          } else {
            ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
            ctx.lineWidth = 1
          }

          ctx.stroke()
        })
      })

      // Draw nodes
      nodes.forEach((node) => {
        const distance = Math.sqrt(Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2))

        ctx.beginPath()
        ctx.arc(node.x, node.y, distance < 100 ? 4 : 2, 0, Math.PI * 2)

        if (distance < 100) {
          ctx.fillStyle = `rgba(34, 197, 94, ${1 - distance / 100})`
        } else {
          ctx.fillStyle = "rgba(59, 130, 246, 0.4)"
        }

        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
      />

      <div className="relative z-10">
        <Header />
        <main>
          <section id="inicio">
            <Hero />
          </section>
          <section className="py-8 px-4">
            <div className="container mx-auto">
              <PromotionalBanner />
            </div>
          </section>
          <section id="productos">
            <AllProductsSection />
          </section>
          <section id="contacto">
            <ContactSection />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}
