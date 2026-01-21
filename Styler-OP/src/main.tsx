import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { store } from './redux/Store.ts'
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>
  </HelmetProvider>
)
