import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

const SHIPPING_MIN_DAYS = 2
const SHIPPING_MAX_DAYS = 3

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const serializeOrder = (order: Awaited<ReturnType<typeof getOrderById>>) => {
  if (!order) {
    return null
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    userId: order.userId ?? null,
    total: order.total,
    itemCount: order.itemCount,
    status: order.status,
    shippingMinDays: order.shippingMinDays,
    shippingMaxDays: order.shippingMaxDays,
    estimatedDelivery: order.estimatedDelivery.toISOString(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    user: order.user
      ? {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
        }
      : null,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            image: item.product.image,
          }
        : null,
    })),
  }
}

async function getOrderById(id: number) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const emailParam = searchParams.get('email')
    if (!emailParam) {
      return NextResponse.json({ error: 'Missing email query parameter' }, { status: 400 })
    }

    const customerEmail = normalizeEmail(emailParam)

    if (!customerEmail) {
      return NextResponse.json({ error: 'Missing email query parameter' }, { status: 400 })
    }

    const orders = await prisma.order.findMany({
      where: { customerEmail },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        userId: order.userId ?? null,
        total: order.total,
        itemCount: order.itemCount,
        status: order.status,
        shippingMinDays: order.shippingMinDays,
        shippingMaxDays: order.shippingMaxDays,
        estimatedDelivery: order.estimatedDelivery.toISOString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        user: order.user
          ? {
              id: order.user.id,
              name: order.user.name,
              email: order.user.email,
            }
          : null,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
          product: item.product
            ? {
                id: item.product.id,
                name: item.product.name,
                image: item.product.image,
              }
            : null,
        })),
      })),
    })
  } catch (error) {
    console.error('GET /api/orders failed', error)
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 })
  }
}

type OrderItemInput = {
  productId: number
  quantity?: number
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const itemsInput = Array.isArray(body?.items) ? (body.items as OrderItemInput[]) : []
    if (!itemsInput.length) {
      return NextResponse.json({ error: 'El pedido no contiene articulos.' }, { status: 400 })
    }

    const productIds = Array.from(new Set(itemsInput.map((item) => item.productId))).filter(Boolean)

    if (!productIds.length) {
      return NextResponse.json({ error: 'Los articulos del pedido no son validos.' }, { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'Uno o mas articulos ya no estan disponibles.' }, { status: 400 })
    }

    const productsMap = new Map(products.map((product) => [product.id, product]))

    const normalizedItems = itemsInput.map((item) => {
      const product = productsMap.get(item.productId)
      const quantity = Math.max(1, Number(item.quantity) || 1)

      if (!product) {
        throw new Error(`Producto ${item.productId} no encontrado`)
      }

      const subtotal = product.price * quantity

      return {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        subtotal,
      }
    })

    const total = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0)
    const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0)

    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + SHIPPING_MAX_DAYS)

    const customerEmail =
      typeof body?.customerEmail === 'string' && body.customerEmail.trim().length
        ? normalizeEmail(body.customerEmail)
        : 'guest@example.com'

    const existingUser = await prisma.user.findUnique({
      where: { email: customerEmail },
    })

    const customerName =
      typeof body?.customerName === 'string' && body.customerName.trim().length
        ? body.customerName.trim()
        : existingUser?.name ?? 'Invitado'

    const orderNumber =
      typeof body?.orderNumber === 'string' && body.orderNumber.trim().length
        ? body.orderNumber.trim().toUpperCase()
        : `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0')}`

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        user: existingUser ? { connect: { id: existingUser.id } } : undefined,
        total,
        itemCount,
        status: 'PENDING',
        shippingMinDays: SHIPPING_MIN_DAYS,
        shippingMaxDays: SHIPPING_MAX_DAYS,
        estimatedDelivery,
        items: {
          create: normalizedItems.map((item) => ({
            product: { connect: { id: item.productId } },
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        },
      },
    })

    const order = await getOrderById(createdOrder.id)

    return NextResponse.json({
      order: serializeOrder(order),
    })
  } catch (error) {
    console.error('POST /api/orders failed', error)
    return NextResponse.json({ error: 'No fue posible registrar el pedido.' }, { status: 500 })
  }
}
