import { Accessor, createContext, createMemo, onMount, type ParentProps } from 'solid-js'
import { createStore } from 'solid-js/store'

type User = {
  id: number
  email: string
}

type UserContextType = {
  user: Accessor<User | null>
  login: (token: string, user: User) => void
  logout: () => void
  register: (token: string, user: User) => void
}

export const UserContext = createContext<UserContextType>()

export const UserProvider = (props: ParentProps) => {
  const [store, setStore] = createStore({
    user: null as User | null,
  })

  const userStore = createMemo(() => store.user)

  onMount(() => {
    const localUser: User | null = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null
    setStore('user', localUser)
  })

  const login = (token: string, user: User) => {
    setStore('user', user)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setStore('user', null)
    localStorage.removeItem('user')
  }

  const register = (token: string, user: User) => {
    setStore('user', user)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  }

  const user = {
    user: userStore,
    login,
    logout,
    register,
  }

  return <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
}
