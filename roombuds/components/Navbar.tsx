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
import { useRouter } from 'next/router'

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext)
  console.log(user)

  const router = useRouter()

  return (
    <AppBar position="static" style={{ background: '#FFFFFF' }}>
      <CssBaseline />
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h4">
          <div style={{ width: '20%', paddingTop: '5px' }}>
            <Image src="/logo.png" alt="logo" width={190} height={60} />
          </div>
        </Typography>
        {!user || !user.email ? (
          <Button
            style={{
              backgroundColor: '#459b55',
              color: 'white',
            }}
            variant="contained"
            href="/login"
          >
            Log in
          </Button>
        ) : (<div> {!user.verified && user.email?.length > 0 ? (
          <Button
            style={{
              backgroundColor: '#459b55',
              color: 'white',
              marginRight: '1em'
            }}
            variant="contained"
            onClick={() => {
              router.push('/verify')
            }}
          >
            Verify
          </Button>
        ) : ''}
          {user.email?.length > 0 ? (
            <Button
              style={{
                backgroundColor: '#459b55',
                color: 'white',
                marginRight: '1em'
              }}
              variant="contained"
              onClick={() => {
                router.push('/quizzes')
              }}
            >
              Quizzes
            </Button>
          ) : ''}

          <Button
            style={{
              backgroundColor: '#459b55',
              color: 'white',
            }}
            variant="contained"
            onClick={() => {
              setUser(null)
              router.push('/')
            }}
          >
            Log out
          </Button>
        </div>
        )}
      </Toolbar>
    </AppBar>
  )
}
