import { createAsync, Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import { MetaProvider } from '@solidjs/meta'

import Header from './components/Header'
import Footer from './components/Footer'
import CartButton from './components/CartButton'

import { UserProvider } from './components/UserContext'
import { CartProvider } from './components/CartContext'

import './app.css'
import { getCatalogQuery } from './api'

export default function App() {
  return (
    <Router
      root={props => {
        const catalog = createAsync(() => getCatalogQuery())

        return (
          <MetaProvider>
            <UserProvider>
              <CartProvider>
                <div class="w-full min-h-[100dvh] container grid grid-rows-[max-content,1fr,max-content]  mx-auto">
                  <Header catalog={catalog() ?? []} />
                  <Suspense>{props.children}</Suspense>
                  <Footer />
                  <CartButton catalog={catalog() ?? []} />
                </div>
              </CartProvider>
            </UserProvider>
          </MetaProvider>
        )
      }}
    >
      <FileRoutes />
    </Router>
  )
}
