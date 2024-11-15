import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  ParentProps,
} from 'solid-js'
import { CatalogItem } from '~/server/db/seed'

type CartContextType = {
  cartItems: Accessor<number[]>
  totalQuantity: Accessor<number>
  addToCart: (productId: number) => void
  removeFromCart: (productId: number) => void
  buy: () => Promise<void>
  useHasProduct: (productId: number) => Accessor<boolean>
  usePrices: (items: Accessor<CatalogItem[]>) => {
    totalPriceWithoutDiscount: Accessor<number>
    totalPriceWithDiscount: Accessor<number>
    totalDiscount: Accessor<number>
  }
}

export const CartContext = createContext<CartContextType>()

export const CartProvider = (props: ParentProps) => {
  const [cartItems, setCartItems] = createSignal<number[]>([])
  const totalQuantity = createMemo(() => cartItems().length)

  const usePrices = (items: Accessor<CatalogItem[]>) => {
    const totalPriceWithoutDiscount = createMemo(() =>
      items().reduce((acc, item) => acc + item.price, 0),
    )

    const totalPriceWithDiscount = createMemo(() =>
      items().reduce((acc, item) => acc + (item.price_discounted || item.price), 0),
    )

    const totalDiscount = createMemo(() => totalPriceWithoutDiscount() - totalPriceWithDiscount())

    return { totalPriceWithoutDiscount, totalPriceWithDiscount, totalDiscount }
  }

  const load = () => {
    try {
      if (!localStorage) return
      const v = localStorage.getItem('cart')
      if (!v) return

      const items = JSON.parse(v) as number[]
      console.log(items)
      setCartItems(items)
    } catch (_e) {
      console.log(_e)
    }
  }

  onMount(load)

  const save = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems()))
  }

  createEffect(save)

  const addToCart = (productId: number) => {
    console.log(cartItems(), productId)
    if (cartItems().includes(productId)) return
    setCartItems(items => [...items, productId])
  }

  const removeFromCart = (productId: number) => {
    setCartItems(items => items.filter(id => id !== productId))
  }

  const buy = async () => {
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: [['Authorization', localStorage.getItem('token') ?? '']],
        body: JSON.stringify({
          order_details: cartItems().map(id => ({
            product_id: id,
            quantity: 1,
          })),
        }),
      })
      if (!res.ok) throw new Error('Ошибка при покупке')

      setCartItems([])
      alert('Заказ успешно создан')
    } catch (_e) {
      alert('Ошибка при покупке')
    }
  }

  const useHasProduct = (productId: number) => {
    return createMemo(() => cartItems().includes(productId))
  }

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, buy, totalQuantity, useHasProduct, usePrices }}
    >
      {props.children}
    </CartContext.Provider>
  )
}
