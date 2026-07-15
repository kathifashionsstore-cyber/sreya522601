import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SiteSettingsProvider } from './context/SiteSettingsContext.jsx'
import { ToastProvider } from './components/shared/Toast.jsx'
import './index.css'

export function render(url, helmetContext = {}) {
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AuthProvider>
          <SiteSettingsProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </SiteSettingsProvider>
        </AuthProvider>
      </StaticRouter>
    </HelmetProvider>
  )

  return { html }
}
