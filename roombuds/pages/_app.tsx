import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { theme } from '../styles/theme'
import { MuiThemeProvider } from '@material-ui/core/styles'

import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <MuiThemeProvider theme={theme}>
        <Component {...pageProps} />
      </MuiThemeProvider>
    </>
  )
}
