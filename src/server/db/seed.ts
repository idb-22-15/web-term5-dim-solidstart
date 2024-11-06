import { db } from './index'

export type UserDb = {
  id: string
  email: string,
  password: string
}

export type CatalogItem = {
  name: string
  uri: string
  description: string
}

const catalog: CatalogItem[] = [
  {
    name: 'Консалтинг',
    uri: 'consulting',
    description: 'Подбор консультационных компаний и предприятий для совместного управления бизнесом',
  },
  {
    name: 'Внедрение',
    uri: 'integration',
    description: 'В корпорации «Галактика» применяются проверенные опытом и временем промышленные технологии выполнения проекта автоматизации управления. Это позволяет провести внедрение наших решений в короткие сроки, с фиксированным бюджетом и минимальными для заказчика рисками.',
  },
  {
    name: 'Сопровождение',
    uri: 'convoy',
    description: 'Техническую поддержку и сопровождение оказывают только дочерние предприятия корпорации «Галактика», региональные отделения и сертифицированные партнеры. Таким образом обеспечивается высокое качество обслуживания всех пользователей, где бы они ни находились. Ни одно обращение заказчика не останется без внимания – это политика корпорации «Галактика»',
  },
  {
    name: 'Консультационный центр',
    uri: 'center',
    description: 'Цель работы Консультационного центра корпорации «Галактика» – организация и проведение консультаций, семинаров, тренингов и подготовка специалистов к эффективному использованию функциональных возможностей программных продуктов корпорации',
  }

]

const createTables = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      uri TEXT NOT NULL,
      description TEXT
      )
    `)

  await db.execute(`
      CREATE TABLE feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        text TEXT NOT NULL
      )
      `)
}

const fillTables = async () => {
  await db.batch(catalog.map((item) => ({ sql: `INSERT INTO catalog (name, uri, description) VALUES (?, ?, ?)`, args: [item.name, item.uri, item.description] })))
}

export const seed = async () => {
  console.log('Seeding...')

  await createTables()
  await fillTables()

  console.log('Seeded!')
}

seed()