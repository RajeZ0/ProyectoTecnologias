import bcrypt from 'bcryptjs'
import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

const categoriesData = [
  {
    name: 'Componentes Pasivos',
    slug: 'componentes-pasivos',
    description: 'Resistencias, capacitores e inductores para tus proyectos.',
    products: [
      {
        name: 'Resistencias de Carbon 1/4W',
        slug: 'resistencias-carbon-1-4w',
        description: 'Kit de 100 resistencias de diferentes valores para prototipos.',
        price: 25,
        originalPrice: 30,
        image: '/resistencia-carbon.png',
        isOffer: true,
        inStock: true,
      },
      {
        name: 'Capacitores Electroliticos',
        slug: 'capacitores-electroliticos',
        description: 'Set de capacitores de 10uF a 1000uF.',
        price: 45,
        image: '/capacitores-electroliticos.png',
        isOffer: false,
        inStock: true,
      },
      {
        name: 'Inductores Toroidales',
        slug: 'inductores-toroidales',
        description: 'Inductores de alta calidad ideales para filtros y fuentes.',
        price: 85,
        image: '/inductores-toroidales.png',
        isOffer: false,
        inStock: true,
      },
    ],
  },
  {
    name: 'Componentes Activos',
    slug: 'componentes-activos',
    description: 'Microcontroladores, semiconductores y circuitos integrados.',
    products: [
      {
        name: 'Arduino Uno R3',
        slug: 'arduino-uno-r3',
        description: 'Microcontrolador ideal para proyectos de automatizacion y aprendizaje.',
        price: 320,
        originalPrice: 380,
        image: '/arduino-uno-r3.png',
        isOffer: true,
        inStock: true,
      },
      {
        name: 'Transistores NPN/PNP',
        slug: 'transistores-npn-pnp',
        description: 'Kit de transistores para aplicaciones de amplificacion.',
        price: 35,
        image: '/transistores-npn-pnp.png',
        isOffer: false,
        inStock: true,
      },
      {
        name: 'Circuitos Integrados 74HC',
        slug: 'circuitos-integrados-74hc',
        description: 'Serie completa de compuertas logicas para practicas digitales.',
        price: 120,
        image: '/circuitos-integrados-74hc.png',
        isOffer: false,
        inStock: false,
      },
      {
        name: 'Diodos y Transistores Variados',
        slug: 'diodos-transistores-variados',
        description: 'Kit completo de semiconductores para reparaciones y pruebas.',
        price: 55,
        image: '/diodos-transistores-variados.png',
        isOffer: false,
        inStock: true,
      },
    ],
  },
  {
    name: 'Fuentes de Energia',
    slug: 'fuentes-de-energia',
    description: 'Soluciones de alimentacion para laboratorios y proyectos.',
    products: [
      {
        name: 'Fuente Variable 0-30V',
        slug: 'fuente-variable-0-30v',
        description: 'Fuente regulable con display digital y proteccion contra sobrecarga.',
        price: 850,
        originalPrice: 950,
        image: '/fuente-variable-0-30v.png',
        isOffer: true,
        inStock: true,
      },
      {
        name: 'Baterias Recargables Li-ion',
        slug: 'baterias-recargables-li-ion',
        description: 'Pack de 4 baterias 18650 con cargador inteligente.',
        price: 180,
        image: '/baterias-recargables-li-ion.png',
        isOffer: false,
        inStock: true,
      },
    ],
  },
  {
    name: 'Instrumentacion',
    slug: 'instrumentacion',
    description: 'Instrumentos de medicion y diagnostico electronico.',
    products: [
      {
        name: 'Multimetro Digital Fluke',
        slug: 'multimetro-digital-fluke',
        description: 'Multimetro profesional de alta precision con medicion True RMS.',
        price: 1200,
        originalPrice: 1400,
        image: '/multimetro-digital-fluke.png',
        isOffer: true,
        inStock: true,
      },
      {
        name: 'Osciloscopio USB 2 Canales',
        slug: 'osciloscopio-usb-2-canales',
        description: 'Osciloscopio portatil para analisis de senales en PC.',
        price: 2500,
        image: '/multimetro-digital-fluke.png',
        isOffer: false,
        inStock: true,
      },
    ],
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Todo lo que necesitas para complementar tus ensambles.',
    products: [
      {
        name: 'Protoboard 830 Puntos',
        slug: 'protoboard-830-puntos',
        description: 'Protoboard de alta calidad ideal para prototipos.',
        price: 65,
        image: '/protoboard-830-puntos.png',
        isOffer: false,
        inStock: true,
      },
      {
        name: 'Cables Jumper Macho-Hembra',
        slug: 'cables-jumper-macho-hembra',
        description: 'Set de 120 cables de conexion flexibles.',
        price: 40,
        originalPrice: 50,
        image: '/cables-jumper-macho-hembra.png',
        isOffer: true,
        inStock: true,
      },
      {
        name: 'Kit de Herramientas Electronicas',
        slug: 'kit-herramientas-electronicas',
        description: 'Herramientas profesionales para mantenimiento electronico.',
        price: 250,
        image: '/kit-herramientas-electronicas.png',
        isOffer: false,
        inStock: true,
      },
      {
        name: 'Cables Jumper Premium',
        slug: 'cables-jumper-premium',
        description: 'Cables de alta calidad con conectores reforzados.',
        price: 35,
        image: '/cables-jumper-premium.png',
        isOffer: false,
        inStock: true,
      },
    ],
  },
]

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.user.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const passwordHash = await bcrypt.hash('guest123', 10)

  const defaultUser = await prisma.user.create({
    data: {
      name: 'Invitado',
      email: 'guest@example.com',
      password: passwordHash,
    },
  })

  for (const category of categoriesData) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        products: {
          create: category.products.map((product) => ({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            isOffer: product.isOffer ?? false,
            inStock: product.inStock ?? true,
          })),
        },
      },
    })
  }

  const sampleProducts = await prisma.product.findMany({
    where: {
      slug: {
        in: ['arduino-uno-r3', 'protoboard-830-puntos'],
      },
    },
  })

  if (sampleProducts.length === 2) {
    const shippingMinDays = 2
    const shippingMaxDays = 3
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + shippingMaxDays)

    const items = sampleProducts.map((product, index) => {
      const quantity = index === 0 ? 1 : 2
      const subtotal = product.price * quantity
      return {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        subtotal,
      }
    })

    const total = items.reduce((sum, item) => sum + item.subtotal, 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    await prisma.order.create({
      data: {
        orderNumber: 'ORD-SEED-001',
        customerName: defaultUser.name,
        customerEmail: defaultUser.email,
        user: { connect: { id: defaultUser.id } },
        total,
        itemCount,
        status: 'PENDING',
        shippingMinDays,
        shippingMaxDays,
        estimatedDelivery,
        items: {
          create: items.map((item) => ({
            product: { connect: { id: item.productId } },
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        },
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error('Seed failed', error)
    await prisma.$disconnect()
    process.exit(1)
  })
