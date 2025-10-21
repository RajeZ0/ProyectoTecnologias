import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

const normalizeEmail = (email: string) => email.trim().toLowerCase()

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const emailInput = typeof body?.email === 'string' ? body.email : ''
    const passwordInput = typeof body?.password === 'string' ? body.password : ''

    const email = normalizeEmail(emailInput)
    const password = passwordInput.trim()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 400 },
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado.' },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('POST /api/auth/register failed', error)
    return NextResponse.json({ error: 'No fue posible crear la cuenta.' }, { status: 500 })
  }
}
