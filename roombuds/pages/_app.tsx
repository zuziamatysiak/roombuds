import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { theme } from '../styles/theme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { useState } from 'react'

import Header from '../components/Header'
import { UserContext } from '../utils/auth'

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(UserContext)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
      <MuiThemeProvider theme={theme}>
        <Component {...pageProps} />
      </MuiThemeProvider>
    </UserContext.Provider>
  )
}
