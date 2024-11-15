import { A } from '@solidjs/router'

export default function Footer() {
  return (
    <footer class="flex gap-8 mt-16 py-8 border-t border-slate-200">
      <p class=" ">© 2024 Галактика. Все права защищены</p>
      <A href="/политика-конфиденциальности.pdf" target="_blank" class="footer-link">
        Политика конфиденциальности
      </A>
    </footer>
  )
}
