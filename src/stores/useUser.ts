import { useContext } from 'solid-js'
import { UserContext } from '~/components/UserContext'

export const useUser = () => {
  return useContext(UserContext)!
}
