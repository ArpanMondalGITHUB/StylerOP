import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { authStore } from './redux/authStore.ts'
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <Provider store={authStore}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>
  </HelmetProvider>
)
