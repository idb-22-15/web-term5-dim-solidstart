import { json } from '@solidjs/router'
import { type APIEvent } from "@solidjs/start/server"
import { z } from 'zod'
import argon from 'argon2'
import { SignJWT } from 'jose'

import { db } from '~/server/db'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
}).refine((ctx) => ctx.password === ctx.confirmPassword, { message: 'Пароли не совпадают' })

export const POST = async ({ request }: APIEvent) => {
  const fd = Object.fromEntries(await request.formData())
  const result = registerSchema.safeParse(fd)
  if (result.error) return json({ error: result.error.errors.map((e) => e.message).join(', ') }, { status: 400 })
  const { data } = result

  const exiting = await db.execute({ sql: `SELECT * FROM users WHERE email = ?`, args: [data.email] })

  if (exiting.rows.length > 0) {
    return json({ error: 'Email уже занят' }, { status: 400 })
  }

  const passwordHash = await argon.hash(data.password)

  const { lastInsertRowid } = await db.execute({ sql: 'INSERT INTO users (email, password) VALUES (?, ?)', args: [data.email, passwordHash] })

  const secret = new TextEncoder().encode('very_private')
  const token = await new SignJWT({
    id: Number(lastInsertRowid),
    email: data.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret)

  return json({ token })
} 