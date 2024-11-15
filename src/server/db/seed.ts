import { hash } from 'argon2'
import { db } from './index'

export type UserDb = {
  id: string
  email: string,
  password: string
}

export type CatalogItemNew = {
  name: string
  slug: string
  description: string,
  price: number
  price_discounted: number | null
}

export type CatalogItem = CatalogItemNew & { id: number }

const catalog: CatalogItemNew[] = [
  {
    name: 'Консалтинг',
    slug: 'consulting',
    description: 'Подбор консультационных компаний и предприятий для совместного управления бизнесом',
    price: 50000,
    price_discounted: 40000,
  },
  {
    name: 'Внедрение',
    slug: 'integration',
    description: 'В корпорации «Галактика» применяются проверенные опытом и временем промышленные технологии выполнения проекта автоматизации управления. Это позволяет провести внедрение наших решений в короткие сроки, с фиксированным бюджетом и минимальными для заказчика рисками.',
    price: 40000,
    price_discounted: null,
  },
  {
    name: 'Сопровождение',
    slug: 'convoy',
    description: 'Техническую поддержку и сопровождение оказывают только дочерние предприятия корпорации «Галактика», региональные отделения и сертифицированные партнеры. Таким образом обеспечивается высокое качество обслуживания всех пользователей, где бы они ни находились. Ни одно обращение заказчика не останется без внимания – это политика корпорации «Галактика»',
    price: 60000,
    price_discounted: null
  },
  {
    name: 'Консультационный центр',
    slug: 'center',
    description: 'Цель работы Консультационного центра корпорации «Галактика» – организация и проведение консультаций, семинаров, тренингов и подготовка специалистов к эффективному использованию функциональных возможностей программных продуктов корпорации',
    price: 40000,
    price_discounted: null
  }
]

const createTables = async () => {
  await db.execute("PRAGMA foreign_keys = ON")

  await db.execute("DROP TABLE IF EXISTS users")
  await db.execute("DROP TABLE IF EXISTS catalog")
  await db.execute("DROP TABLE IF EXISTS orders")
  await db.execute("DROP TABLE IF EXISTS order_details")
  await db.execute("DROP TABLE IF EXISTS feedbacks")

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS catalog (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      price INT NOT NULL,
      price_discounted INT
      )
    `)

  await db.execute(`
      CREATE TABLE feedbacks (
        id INTEGER PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id),
        text TEXT NOT NULL
      )
      `)

  await db.execute(`
        CREATE TABLE orders (
          id INTEGER PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id),
          date TEXT NOT NULL
        )
  `)

  await db.execute(`
    CREATE TABLE order_details (
      id INTEGER PRIMARY KEY,
      order_id INT NOT NULL REFERENCES orders(id),
      product_id INT NOT NULL REFERENCES catalog(id),
      quantity INT NOT NULL DEFAULT 1,
      price INT NOT NULL,
      price_discounted INT
    )`)
}

export type OrderNew = {
  user_id: number
  date: string
}

export type Order = OrderNew & { id: number }

export type OrderDetailsNew = {
  order_id: number
  product_id: number
  quantity: number
  price: number
  price_discounted: number | null
}

export type OrderDetails = OrderDetailsNew & { id: number }

const fillTables = async () => {
  await db.batch(catalog.map((item) => ({
    sql: `INSERT INTO catalog (name, slug, description, price, price_discounted) VALUES (?, ?, ?, ?, ?)`,
    args: [item.name, item.slug, item.description, item.price, item.price_discounted]
  })))

  const user = {
    email: 'user@example.com',
    password: await hash('12345678'),
  }

  await db.execute({ sql: 'INSERT INTO users (email, password) VALUES (?, ?)', args: [user.email, user.password] })
}

export const seed = async () => {
  console.log('Seeding...')

  await createTables()
  await fillTables()

  console.log('Seeded!')
}

seed()