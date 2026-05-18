import '../styles/globals.css'
import 'leaflet/dist/leaflet.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
