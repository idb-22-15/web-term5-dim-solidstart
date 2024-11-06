import { json } from '@solidjs/router'
import { type APIEvent } from "@solidjs/start/server"
import { z } from 'zod'
import argon from 'argon2'
import { SignJWT } from 'jose'

import { db } from '~/server/db'
import { UserDb } from '~/server/db/seed'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const POST = async ({ request }: APIEvent) => {
  const fd = Object.fromEntries(await request.formData())
  const result = loginSchema.safeParse(fd)
  if (result.error) return json({ error: result.error.errors.map((e) => e.message).join(', ') }, { status: 400 })

  const { data } = result

  const { rows } = await db.execute({ sql: `SELECT * FROM users WHERE email = ?`, args: [data.email] })
  const user = rows[0] as unknown as UserDb | undefined

  if (!user) {
    return json({ error: 'Неверный email или пароль' }, { status: 400 })
  }

  if (!(await argon.verify(user.password, data.password))) {
    return json({ error: 'Неверный email или пароль' }, { status: 400 })
  }

  const secret = new TextEncoder().encode('very_private')
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret)

  return json({ token })
}