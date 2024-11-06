export default function Contacts() {
  return (
    <main>
      <h1 class="text-4xl font-bold mt-8 ">Контакты</h1>

      <section class="mt-6 grid grid-cols-2 gap-6">
        <div class="">
          <p>
            Телефон: <a href="tel:+7 495 252-02-55">+7 (495) 252-02-55</a>
          </p>
          <p>
            Почта: <a href="email:market@galaktika.ru">market@galaktika.ru</a>
          </p>
          <p>Адрес: 125167, г. Москва, Театральная аллея, д.3, с. 1</p>
        </div>
        <script
          type="text/javascript"
          charset="utf-8"
          src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A6c7d8a0c938d17beacc4e96de967049ef5568bd47f7a378a0b33455107b3e094&amp;width=500&amp;height=400&amp;lang=ru_RU&amp;scroll=true"
        ></script>
      </section>
    </main>
  )
}
