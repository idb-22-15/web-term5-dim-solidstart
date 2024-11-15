import { For, Show, createMemo, createSignal } from 'solid-js'
import { A, redirect } from '@solidjs/router'
import ShoppingCart from 'lucide-solid/icons/shopping-cart'
import { CatalogItem } from '~/server/db/seed'
import { useCart } from '~/stores/useCart'
import { useUser } from '~/stores/useUser'
import { getCatalogQuery } from '~/api'
import { getCatalog } from '~/server/actions'

export default function CartButton({
  catalog: catalog,
}: {
  catalog: Awaited<ReturnType<typeof getCatalog>>
}) {
  const { user } = useUser()
  const { cartItems, totalQuantity, usePrices, removeFromCart, buy } = useCart()
  const getItem = (id: number) => catalog.find(item => item.id === id)!
  const items = createMemo(() => {
    return cartItems().map(id => getItem(id))
  })

  const { totalPriceWithoutDiscount, totalPriceWithDiscount, totalDiscount } = usePrices(items)

  const [isOpen, setIsOpen] = createSignal(false)

  return (
    <div class="fixed rounded-full bg-slate-100 text-black bottom-8 right-10">
      <div class="absolute font-bold top-0 right-4">{totalQuantity()}</div>
      <ShoppingCart
        onClick={() => setIsOpen(isOpen => !isOpen)}
        class="p-4 w-16 h-16 cursor-pointer"
      />
      <Show when={isOpen()}>
        <div class="fixed bottom-32 right-10 p-8 bg-slate-100 ">
          <Show fallback={<div class="text-center">В корзине пусто</div>} when={items().length}>
            <div class="grid grid-cols-[max-content,max-content] gap-x-16">
              <table class="grid grid-cols-[max-content,max-content,max-content,max-content] gap-x-8">
                <tbody class="grid grid-cols-subgrid col-span-full gap-y-4">
                  <For each={items()}>
                    {(item, i) => (
                      <tr class="grid grid-cols-subgrid col-span-full items-center h-fit">
                        <td>
                          <img
                            src={item.image}
                            alt={item.name}
                            class="h-[100px] w-[200px] object-cover"
                          />
                        </td>
                        <td>{item.name}</td>
                        <td class="flex flex-col gap-y-1">
                          <Show fallback={<span>{item.price} ₽</span>} when={item.price_discounted}>
                            <span>{item.price_discounted} ₽</span>
                            <span class="line-through text-sm">{item.price} ₽</span>
                          </Show>
                        </td>
                        <td>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            class="btn btn-xs btn-error"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
              <div class="flex flex-col gap-y-8 h-full justify-between">
                <div class="grid grid-cols-[max-content,auto] gap-x-4 gap-y-2 h-fit">
                  <span>Кол-во товаров</span>
                  <span>{totalQuantity()}</span>
                  <span>Цена без скидки</span>
                  <span>{totalPriceWithoutDiscount()} ₽</span>
                  <span>Скидка</span>
                  <span>{totalDiscount()} ₽</span>
                  <span>Итоговая цена</span>
                  <span class="font-bold">{totalPriceWithDiscount()} ₽</span>
                </div>
                <Show
                  fallback={
                    <button onClick={buy} class="btn btn-primary w-full">
                      Оплатить
                    </button>
                  }
                  when={!user()}
                >
                  <A class="btn btn-primary w-full" href="/login">
                    Войти, чтобы купить
                  </A>
                </Show>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  )
}
