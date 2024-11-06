import { Title } from '@solidjs/meta'
import { decodeJwt } from 'jose'
import { createSignal, Show } from 'solid-js'
import { useUser } from '~/stores/useUser'

export default function Feedback() {
  const [error, setError] = createSignal<string>()
  const [text, setText] = createSignal<string>()
  const { user } = useUser()

  createSignal(() => {
    if (!user()) location.href = '/login'
  })

  const onSubmit = async (e: Event) => {
    e.preventDefault()
    setError(undefined)
    setText(undefined)
    const fd = new FormData(e.target as HTMLFormElement)

    const res = await fetch('/api/feedback', {
      method: 'POST',
      body: fd,
      headers: [['Authorization', localStorage.getItem('token') ?? '']],
    })

    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      setText(data.message)
    }
  }

  return (
    <>
      <Title>Обратная связь</Title>
      <main>
        <h1 class="text-4xl font-bold mt-8 ">Обратная связь</h1>
        <section class="mt-6 flex flex-col gap-y-6">
          <form class="flex gap-x-8" onSubmit={onSubmit}>
            <textarea name="text" class="textarea textarea-bordered w-96"></textarea>
            <button class="btn btn-primary">Отправить</button>
          </form>
          <Show when={error()}>
            <p class="text-error">{error()}</p>
          </Show>
          <Show when={text()}>
            <p class="text-success">{text()}</p>
          </Show>
        </section>
      </main>
    </>
  )
}
