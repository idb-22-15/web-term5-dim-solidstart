import { z } from 'zod'
import { db } from '~/server/db'
import { CatalogItem, OrderDetailsNew } from '~/server/db/seed'
import { type APIEvent } from "@solidjs/start/server"
import { json } from '@solidjs/router'
import { jwtVerify } from 'jose'

export const createOrder = async (userId: number, order_details: OrderDetailsNew[]) => {

}

const schema = z.object({
  order_details: z.array(
    z.object({
      product_id: z.number(),
      quantity: z.number(),
      // price: z.number(),
      // price_discounted: z.number().nullable(),
    }),
  ),
})

export const POST = async ({ request }: APIEvent) => {
  if (!request.headers.get('Authorization')) return json({ error: 'Не авторизован' }, { status: 401 })
  const { payload } = await jwtVerify(request.headers.get('Authorization')!, new TextEncoder().encode('very_private'))
  const user = payload as { id: number }

  const result = schema.safeParse(await request.json())
  if (result.error) return json({ error: result.error.errors.map((e) => e.message).join(', ') }, { status: 400 })
  const { data } = result

  console.log('passed schema', data)
  const order = await db.execute({ sql: 'INSERT INTO orders (user_id, date) VALUES (?, ?)', args: [user.id, new Date().toISOString().slice(0, 10)] })
  const orderId = Number(order.lastInsertRowid)

  const order_details = data.order_details.toSorted((a, b) => a.product_id - b.product_id)
  const catalog = ((await db.execute({
    sql: 'SELECT * FROM catalog WHERE id IN (?)',
    args: [order_details.map(item => item.product_id).join(',')]
  })).rows as unknown as CatalogItem[]).toSorted((a, b) => a.id - b.id)
  console.log('ids catalog', catalog)

  const res = await db.batch(order_details.map((item, idx) => ({
    sql: 'INSERT INTO order_details (order_id, product_id, quantity, price, price_discounted) VALUES (?, ?, ?, ?, ?)',
    args: [orderId, item.product_id, item.quantity, catalog[idx].price, catalog[idx].price_discounted],
  })))

  console.log(res)
  return json({ message: 'Заказ успешно создан' })
}