import { Navbar } from '../components/Navbar'
import {
  CssBaseline,
  Typography,
  Button,
  TextField,
  Link,
  Box,
  Container,
} from '@material-ui/core'
import { useContext, useState } from 'react'
import { get } from '../utils/database'
import { USER_TABLE } from '../utils/constants'
import { useRouter } from 'next/router'
import { UserContext } from '../utils/auth'

// function to query database for user with email
// validates if passwords match
const validateLogin = async (email: string, password: string) => {
  const userInfo = await get('email', email, USER_TABLE)
  // TODO: better handle errors and display them to user
  if (!userInfo.success) {
  } else {
    if (userInfo.data == null) {
      console.log('Wrong username')
      return false
    } else if (userInfo.data.password == password) {
      console.log(
        'users::read::success - ' + JSON.stringify(userInfo.data, null, 2)
      )
      return true
    } else {
      console.log('Wrong password')
      return false
    }
  }
}

export default function LoginPage() {
  const context = useContext(UserContext)
  const router = useRouter()

  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPassInput] = useState('')

  async function handleSubmit() {
    const success = await validateLogin(emailInput, passwordInput)
    if (success) {
      context.setUser({ email: emailInput })
      router.push('/dashboard')
    }
  }

  return (
    <div>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          style={{
            marginTop: 150,
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5">Login 🌱</Typography>
          <TextField
            //   variant="outlined" TODO: fix potentially
            id="email"
            label="Email Address"
            required
            fullWidth
            style={{ marginTop: 20 }}
            onChange={(e) => {
              setEmailInput(e.target.value)
            }}
          />
          <TextField
            //   variant="outlined"
            label="Password"
            type="password"
            id="password"
            required
            fullWidth
            style={{ marginTop: 20 }}
            onChange={(e) => {
              setPassInput(e.target.value)
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            style={{
              marginTop: 20,
              backgroundColor: '#459b55',
              color: 'white',
            }}
          >
            {' '}
            Login{' '}
          </Button>
          <Link href="/signup" variant="body2">
            {'Are you not a roombud yet? Sign up! :)'}
          </Link>
        </Box>
      </Container>
    </div>
  )
}
