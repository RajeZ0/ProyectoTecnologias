import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

const normalizeEmail = (email: string) => email.trim().toLowerCase()

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const emailInput = typeof body?.email === 'string' ? body.email : ''
    const passwordInput = typeof body?.password === 'string' ? body.password : ''

    const email = normalizeEmail(emailInput)
    const password = passwordInput.trim()

    if (!email || !password) {
      return NextResponse.json({ error: 'Correo y contraseña son obligatorios.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('POST /api/auth/login failed', error)
    return NextResponse.json({ error: 'No fue posible iniciar sesión.' }, { status: 500 })
  }
}
