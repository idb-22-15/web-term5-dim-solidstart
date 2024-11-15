import { Title } from '@solidjs/meta'
import { createAsync, useParams } from '@solidjs/router'
import { createMemo, Show } from 'solid-js'
import { getCatalogQuery } from '~/api'
import { useCart } from '~/stores/useCart'

export const router = {
  preload: () => getCatalogQuery(),
}

export default function CatalogItemSlug() {
  const slug = () => useParams().slug
  const { addToCart, removeFromCart, useHasProduct } = useCart()

  const catalog = createAsync(() => getCatalogQuery())

  const product = createMemo(() => {
    return catalog()?.find(item => item.slug === slug())
  })

  const hasProduct = createMemo(() => {
    if (product() === undefined) return false
    const has = useHasProduct(product()!.id)
    console.log('has', has())
    return has()
  })

  return (
    <Show when={product()}>
      {product => (
        <>
          <Title>{product().name}</Title>
          <main class="text-xl">
            <h1 class="text-4xl font-bold mt-8 ">{product().name}</h1>
            <section class="mt-6 grid grid-cols-2 gap-x-10 gap-y-16">
              <img src={product().image} alt={product().name} />
              <div class="flex flex-col">
                <p class="font-bold text-2xl">{product().price}р</p>
                <p class="mt-4">{product().description}</p>
                <Show
                  fallback={
                    <button onClick={() => addToCart(product().id)} class="mt-12 btn btn-primary">
                      Добавить в корзину
                    </button>
                  }
                  when={hasProduct()}
                >
                  <button onClick={() => removeFromCart(product().id)} class="mt-12 btn btn-error">
                    Удалить из корзины
                  </button>
                </Show>
              </div>
            </section>
          </main>
        </>
      )}
    </Show>
  )
}
