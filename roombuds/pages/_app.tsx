import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { theme } from '../styles/theme'
import { MuiThemeProvider } from '@material-ui/core/styles'

import Header from '../components/Header'
import { useEffect } from 'react'
import { CssBaseline } from '@material-ui/core'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) jssStyles.parentElement?.removeChild(jssStyles)
  }, [])

  return (
    <>
      <Header />
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </MuiThemeProvider>
    </>
  )
}
