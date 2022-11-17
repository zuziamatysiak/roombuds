import Image from 'next/image'
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Button,
} from '@material-ui/core'
import { useContext } from 'react'
import { UserContext } from '../utils/auth'

export const Navbar = () => {
  const { user } = useContext(UserContext)

  return (
    <AppBar position="static" style={{ background: '#FFFFFF' }}>
      <CssBaseline />
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h4">
          <div style={{ width: '20%', paddingTop: '5px' }}>
            <Image src="/logo.png" alt="logo" width={190} height={60} />
          </div>
        </Typography>
        {!user ? (
          <Button
            style={{
              backgroundColor: '#459b55',
              color: 'white',
            }}
            variant="contained"
            href="/login"
          >
            Sign in
          </Button>
        ) : (
          // TODO: implement logout
          <Button
            style={{
              backgroundColor: '#459b55',
              color: 'white',
            }}
            variant="contained"
            href="/"
          >
            Log out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
