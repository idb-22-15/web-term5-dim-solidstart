import { useContext } from 'solid-js'
import { CartContext } from '~/components/CartContext'

export const useCart = () => {
  return useContext(CartContext)!
}