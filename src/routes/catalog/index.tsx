import { A, useSearchParams } from '@solidjs/router'
import { For, Show, createEffect, createResource, createSignal } from 'solid-js'
import { CatalogItem } from '~/server/db/seed'

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = createSignal(searchParams.filter as string | undefined)

  createEffect(() => {
    if (searchParams.filter !== filter()) setFilter(searchParams.filter as string | undefined)
  })

  const [catalog] = createResource('catalog', async () => {
    const res = await fetch('http://localhost:3000/api/catalog')
    const data = (await res.json()) as CatalogItem[]
    return data.map(item => ({
      ...item,
      href: `/catalog/${item.uri}`,
      image: `/images/catalog/${item.uri}.jpg`,
    }))
  })

  const filteredCatalog = () => {
    if (!filter() || catalog() === undefined) return catalog()
    return catalog()!.filter(
      item =>
        item.name.toLowerCase().includes(filter()!.toLowerCase()) ||
        item.description.toLowerCase().includes(filter()!.toLowerCase()),
    )
  }

  return (
    <main class="text-xl">
      <h1 class="text-4xl font-bold mt-8 ">Каталог</h1>
      <section class="mt-6 grid grid-cols-2 gap-x-10 gap-y-16">
        <For each={filteredCatalog()}>
          {(item, i) => (
            <div class="flex justify-start flex-col">
              <img class="w-full h-[400px]" src={item.image} alt={item.name} />
              <h4 class="mt-5 font-bold">{item.name}</h4>
              <p class="mt-2">{item.description}</p>
              <A href={item.href} class="justify-self-end mt-6 btn w-fit btn-sm btn-outline">
                Подробнее
              </A>
            </div>
          )}
        </For>
      </section>
    </main>
  )
}
