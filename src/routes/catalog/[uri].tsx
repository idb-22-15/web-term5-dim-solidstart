import { Title } from '@solidjs/meta'
import { useParams } from '@solidjs/router'
import { createResource } from 'solid-js'
import { CatalogItem } from '~/server/db/seed'

export default function CatalogItemUri() {
  const uri = () => useParams().uri

  const [item] = createResource(uri, async uri => {
    const res = await fetch(`http://localhost:3000/api/catalog`)
    const data = (await res.json()) as CatalogItem[]
    const item = data.find(item => item.uri === uri)
    if (!item) return undefined
    return { ...item, image: `/images/catalog/${item.uri}.jpg` }
  })

  return (
    <>
      <Title>{item()?.name}</Title>
      <main class="text-xl">
        <h1 class="text-4xl font-bold mt-8 ">{item()?.name}</h1>
        <section class="mt-6 grid grid-cols-2 gap-x-10 gap-y-16">
          <img src={item()?.image} alt={item()?.name} />
          <p>{item()?.description}</p>
        </section>
      </main>
    </>
  )
}
