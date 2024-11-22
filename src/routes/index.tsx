import { Title } from '@solidjs/meta'
import { For } from 'solid-js'

type NewsItem = {
  order: string
  title: string
  image: string
  url: string
  date: string
}

const news: NewsItem[] = [
  {
    order: '1',
    title: 'Корпорация «Галактика» получила лицензии ФСТЭК России',
    image: 'https://galaktika.ru/wp-content/uploads/2024/11/fstec.png',
    url: 'https://galaktika.ru/archives/40370',
    date: '08.11.2024',
  },
  {
    order: '2',
    title:
      'Промышленность рассматривает систему «Галактика Quantum.ERP» в качестве основы для построения комплексного решения по автоматизации',
    image: 'https://galaktika.ru/wp-content/uploads/2024/09/ptk_0779-pic4_zoom-1500x1500-46239.jpg',
    url: 'https://galaktika.ru/archives/40362',
    date: '31.10.2024',
  },
  {
    order: '3',
    title: 'VK Tech заключил соглашение о партнерстве с корпорацией «Галактика»',
    image: 'https://galaktika.ru/wp-content/uploads/2024/10/vktech.jpg',
    url: 'https://galaktika.ru/archives/40333',
    date: '15.10.2024',
  },
  {
    order: '4',
    title: '«ТерраЛинк» и «Галактика» заключили соглашение о стратегическом партнерстве',
    image: 'https://galaktika.ru/wp-content/uploads/2024/10/2.10-6.jpg',
    url: 'https://galaktika.ru/archives/40317',
    date: '03.10.2024',
  },
]

export default function Home() {
  return (
    <>
      <Title>Галактика</Title>
      <main class="">
        <div
          class="hero h-dvh"
          style="background-image: url(https://galaktika.ru/wp-content/uploads/2019/04/bg_main2.jpg);"
        >
          <div class="hero-overlay bg-opacity-60"></div>
          <div class="hero-content text-neutral-content text-center">
            <div class="max-w-lg">
              <h1 class=" mb-5 text-5xl font-bold">Галактика цифровых решений</h1>
              <p class="mb-5">Мы занимаемся разработкой программных решений более 35 лет</p>
            </div>
          </div>
        </div>
        <div class="mt-8 text-xl">
          <p>
            Корпорация «Галактика» - отечественный разработчик информационных бизнес-систем в
            странах СНГ. Компания с 1987 года самостоятельно создает, поставляет и поддерживает
            передовые ИТ-решения в области управления предприятием. На ноябрь 2015 года корпорация
            «Галактика» предлагала компаниям, предприятиям, организациям комплекс решений для
            эффективного управления бизнесом. Ядром комплекса являлась система «Галактика ERP» –
            интегрированная система управления для предприятий – и отраслевые решения на ее базе
            («Галактика Машиностроение», «Галактика Управление транспортом», «Галактика Управление
            строительством», «Галактика Управление вузом» и др.). Мы оказываем услуги:
          </p>
        </div>

        <section class="mt-10">
          <h3 class="text-3xl font-bold">Новости</h3>
          <div class="mt-4 carousel gap-40">
            <For each={news}>
              {n => (
                <div
                  id={`item-${n.order}`}
                  class="carousel-item w-full grid grid-cols-[3fr,1fr] gap-8"
                >
                  <img src={n.image} class="w-full max-h-[70dvh] object-cover" />
                  <div class="flex flex-col gap-4">
                    <p class="text-2xl font-bold">{n.title}</p>
                    <p>{n.date}</p>
                    <a href={n.url} class="btn btn-outline w-fit">
                      Читать
                    </a>
                  </div>
                </div>
              )}
            </For>
          </div>
          <div class="flex w-full justify-center gap-2 py-2">
            <For each={news}>
              {n => (
                <a href={`#item-${n.order}`} class="btn btn-xs">
                  {n.order}
                </a>
              )}
            </For>
          </div>
        </section>
      </main>
    </>
  )
}
