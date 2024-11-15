'use server'

import { db } from '../db'
import { type CatalogItem } from '../db/seed'

export const getCatalog = async () => {
  const catalog = (await db.execute('SELECT * FROM catalog')).rows as unknown as CatalogItem[]
  return catalog.map(item => ({
    ...item,
    href: `/catalog/${item.slug}`,
    image: `/images/catalog/${item.slug}.jpg`,
  }))
}

export const getCatalogItem = async (slug: string) => {
  return (await db.execute({ sql: 'SELECT * FROM catalog WHERE slug = ?', args: [slug] })).rows[0] as unknown as CatalogItem
}

