import { A } from '@solidjs/router'
import { createEffect, createMemo, createResource, createSignal, For, Show } from 'solid-js'
import { getCatalog } from '~/server/actions'
import { CatalogItemNew } from '~/server/db/seed'
import { useUser } from '~/stores/useUser'

type Link = {
  name: string
  needAuth?: boolean
  children?: Link[]
  url?: string
}

const _links: Link[] = [
  {
    name: 'Каталог',
    needAuth: false,
    children: [],
  },
  {
    name: 'О нас',
    needAuth: false,
    url: '/about',
  },
  {
    name: 'Контакты',
    needAuth: false,
    url: '/contacts',
  },
  {
    name: 'Обратная связь',
    needAuth: true,
    url: '/feedback',
  },
]

const links = [
  {
    name: 'Каталог',
    needAuth: false,
    children: [
      { name: 'Консалтинг', needAuth: false, url: '/catalog/consulting' },
      { name: 'Внедрение', needAuth: false, url: '/catalog/integration' },
      { name: 'Сопровождение', needAuth: false, url: '/catalog/convoy' },
      { name: 'Консультационный центр', needAuth: false, url: '/catalog/center' },
    ],
  },
  { name: 'О нас', needAuth: false, url: '/about' },
  { name: 'Контакты', needAuth: false, url: '/contacts' },
  { name: 'Обратная связь', needAuth: true, url: '/feedback' },
]

export default function Header({ catalog }: { catalog: Awaited<ReturnType<typeof getCatalog>> }) {
  const { user, logout } = useUser()
  const [search, setSearch] = createSignal('')
  console.log(catalog)

  // const catalogLinks = createMemo(() =>
  //   catalog.map(d => ({
  //     name: d.name,
  //     needAuth: false,
  //     url: `/catalog/${d.slug}`,
  //   })),
  // )
  // const [catalogLinks, { refetch }] = createResource(
  //   async () => {
  //     const res = await fetch('http://localhost:3000/api/catalog')
  //     const data = (await res.json()) as CatalogItemNew[]
  //     const links: Link[] = data.map(d => ({
  //       name: d.name,
  //       needAuth: false,
  //       url: `/catalog/${d.slug}`,
  //     }))
  //     return links
  //   },
  //   {
  //     ssrLoadFrom: 'initial',
  //   },
  // )

  // refetch()

  // const links = createMemo(() => {
  //   const links = structuredClone(_links)
  //   if (catalogLinks()) links[0].children = catalogLinks()
  //   return links.filter(link => (user() ? true : !link.needAuth))
  // })
  // console.log(JSON.stringify(links()))

  return (
    <header class="w-full flex gap-x-8 justify-between items-center h-20 border-b border-slate-200">
      <A href="/" class="w-fit">
        <img src="/images/logo.png" alt="logo" class="invert  min-h-12 h-12 min-w-[160px]" />
      </A>
      <nav class="flex">
        <ul class="menu menu-horizontal flex flex-nowrap w-max">
          <For each={links}>
            {link => (
              <li class="w-fit">
                <Show fallback={<A href={link.url!}>{link.name}</A>} when={link.children}>
                  <details>
                    <summary>{link.name}</summary>
                    <ul>
                      <For each={link.children ?? []}>
                        {child => (
                          <li>
                            <A href={child.url!}>{child.name}</A>
                          </li>
                        )}
                      </For>
                    </ul>
                  </details>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </nav>
      <div class="flex gap-3 w-full">
        <input
          type="text"
          class="input input-bordered w-full"
          value={search()}
          onInput={e => setSearch(e.target.value)}
          placeholder="Поиск"
        />
        <A href={`/catalog/?filter=${search()}`} class="btn btn-outline">
          Найти
        </A>
      </div>
      <div class="flex gap-x-2 items-center">
        <Show
          when={user()}
          fallback={
            <>
              <a class="btn btn-primary" href="/login">
                Вход
              </a>
              <a class="btn btn-outline" href="/register">
                Регистрация
              </a>
            </>
          }
        >
          <details class="dropdown">
            <summary class="text-nowrap">{user()!.email}</summary>
            <ul class="menu dropdown-content">
              <li>
                <button onClick={logout} class="btn btn-error">
                  Выйти
                </button>
              </li>
            </ul>
          </details>
        </Show>
      </div>
    </header>
  )
}
