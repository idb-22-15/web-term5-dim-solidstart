import { A, useNavigate } from '@solidjs/router'
import { createSignal, Show } from 'solid-js'
import { useUser } from '~/stores/useUser'
import { decodeJwt } from 'jose'

export default function Login() {
  const navigate = useNavigate()
  const { register } = useUser()
  const [error, setError] = createSignal<string>()

  const onSubmit = async (e: Event) => {
    e.preventDefault()
    setError(undefined)
    const fd = new FormData(e.target as HTMLFormElement)

    const res = await fetch('/api/register', {
      method: 'POST',
      body: fd,
    })

    const data = await res.json()

    if (data.error) {
      setError(data.error)
    } else {
      const { token } = data
      register(token, decodeJwt(token) as any)
      navigate('/')
    }
  }
  return (
    <main>
      <h1 class="text-4xl font-bold mt-8 ">Регистрация</h1>
      <section class="mt-6 flex flex-col gap-y-6">
        <form class="flex gap-x-8" onSubmit={onSubmit}>
          <input type="text" name="email" class="input input-bordered w-80" placeholder="Почта" />
          <input
            type="password"
            name="password"
            class="input input-bordered w-80"
            placeholder="Пароль"
          />
          <input
            type="password"
            name="confirmPassword"
            class="input input-bordered w-80"
            placeholder="Повторите пароль"
          />
          <button class="btn btn-primary">Войти</button>
        </form>
        <Show when={error()}>
          <p class="text-error">{error()}</p>
        </Show>
        <A class="link link-primary no-underline" href="/login">
          Вход
        </A>
      </section>
    </main>
  )
}
