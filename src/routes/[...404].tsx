import { Title } from '@solidjs/meta'
import { A } from '@solidjs/router'

export default function NotFound() {
  return (
    <>
      <Title>Страница не найдена</Title>
      <main class="text-xl mt-8">
        <h1 class="font-bold text-4xl">О нас</h1>
      </main>
    </>
  )
}
