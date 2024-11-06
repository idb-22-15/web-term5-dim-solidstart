import { type APIEvent } from "@solidjs/start/server"
import { json } from '@solidjs/router'
import { z } from 'zod'
import { db } from '~/server/db'
import { jwtVerify } from 'jose'


const feedbackSchema = z.object({
  text: z.string()
})

export const POST = async ({ request }: APIEvent) => {
  if (!request.headers.get('Authorization')) return json({ error: 'Не авторизован' }, { status: 401 })
  const { payload } = await jwtVerify(request.headers.get('Authorization')!, new TextEncoder().encode('very_private'))
  const user = payload as { id: number }

  const fd = Object.fromEntries(await request.formData())
  const result = feedbackSchema.safeParse(fd)
  if (result.error) return json({ error: result.error.errors.map((e) => e.message).join(', ') }, { status: 400 })
  const { data } = result

  const { rows } = await db.execute({ sql: `INSERT INTO feedback (user_id, text) VALUES (?, ?)`, args: [user.id, data.text] })

  return json({ message: 'Сообщение отправлено' })
}