import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import { MetaProvider } from '@solidjs/meta'

import Header from './components/Header'
import Footer from './components/Footer'
import { UserProvider } from './components/UserContext'
import './app.css'

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <UserProvider>
            <div class="w-full min-h-[100dvh] container grid grid-rows-[max-content,1fr,max-content]  mx-auto">
              <Header />
              <Suspense>{props.children}</Suspense>
              <Footer />
            </div>
          </UserProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
