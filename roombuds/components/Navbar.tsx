import Image from 'next/image'
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  Button,
} from '@material-ui/core'
import { useUser } from '../utils/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCookies } from 'react-cookie'

export const Navbar = () => {
  const [user] = useUser()
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const router = useRouter()

  return (
    <AppBar position="static" style={{ background: '#FFFFFF' }}>
      <CssBaseline />
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h4">
          <div style={{ width: '20%', paddingTop: '5px' }}>
            <Link href={user.email ? '/explore' : '/'}>
              <Image src="/logo.png" alt="logo" width={190} height={60} />
            </Link>
          </div>
        </Typography>
        {!user.email || router.pathname === '/' ? (
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
        ) : (
          <div>
            {!user.verified && (
              <Button
                style={{
                  backgroundColor: '#459b55',
                  color: 'white',
                  marginRight: '1em',
                }}
                variant="contained"
                onClick={() => {
                  router.push('/verify')
                }}
              >
                Verify
              </Button>
            )}
            <Button
              style={{
                backgroundColor: '#459b55',
                color: 'white',
                marginRight: '1em',
              }}
              variant="contained"
              onClick={() => {
                router.push('/quizzes')
              }}
            >
              Quizzes
            </Button>
            <Button
              style={{
                backgroundColor: '#459b55',
                color: 'white',
                marginRight: '1em',
              }}
              variant="contained"
              onClick={() => {
                router.push('/explore')
              }}
            >
              Explore
            </Button>
            <Button
              style={{
                backgroundColor: '#459b55',
                color: 'white',
                marginRight: '1em',
              }}
              variant="contained"
              onClick={() => {
                router.push('/matches')
              }}
            >
              Matches
            </Button>
            <Button
              style={{
                backgroundColor: '#459b55',
                color: 'white',
              }}
              variant="contained"
              onClick={() => {
                removeCookie('user', { path: '/' })
                localStorage.clear()
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
