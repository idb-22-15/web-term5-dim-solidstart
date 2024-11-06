import { A, useNavigate } from '@solidjs/router'
import { createSignal, Show } from 'solid-js'
import { decodeJwt } from 'jose'
import { useUser } from '~/stores/useUser'
import { Title } from '@solidjs/meta'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = createSignal<string>()
  const { login } = useUser()

  const onSubmit = async (e: Event) => {
    e.preventDefault()
    setError(undefined)
    const fd = new FormData(e.target as HTMLFormElement)

    const res = await fetch('/api/login', {
      method: 'POST',
      body: fd,
    })

    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      const { token } = data
      const user = decodeJwt(token)
      login(token, user as any)
      navigate('/')
    }
  }

  return (
    <>
      <Title>Вход</Title>
      <main>
        <h1 class="text-4xl font-bold mt-8 ">Вход</h1>
        <section class="mt-6 flex flex-col gap-y-6">
          <form class="flex gap-x-8" onSubmit={onSubmit}>
            <input type="text" name="email" class="input input-bordered w-80" placeholder="Почта" />
            <input
              type="password"
              name="password"
              class="input input-bordered w-80"
              placeholder="Пароль"
            />

            <button class="btn btn-primary">Войти</button>
          </form>
          <Show when={error()}>
            <p class="text-error">{error()}</p>
          </Show>
          <A class="link link-primary no-underline" href="/register">
            Регистрация
          </A>
        </section>
      </main>
    </>
  )
}
