import { json } from '@solidjs/router'
import { db } from '~/server/db'

export const GET = async () => {
  return json((await db.execute('SELECT * FROM catalog')).rows)
}