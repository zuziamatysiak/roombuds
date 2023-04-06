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
import { useState } from 'react'
import { get } from '../utils/database'
import { USER_TABLE } from '../utils/constants'
import { useRouter } from 'next/router'
import { useUser } from '../utils/auth'
import { GetResponse } from '../utils/types'

export default function LoginPage() {
  const [user, setUser] = useUser()
  const [errorMsg, setErrorMsg] = useState('')

  const router = useRouter()

  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPassInput] = useState('')

  // function to query database for user with email
  // validates if passwords match
  const validateLogin = async (
    username: string,
    password: string
  ): Promise<GetResponse> => {
    const userInfo = await get('username', username, USER_TABLE)
    if (!userInfo.success) {
      return userInfo
    } else {
      if (userInfo.data == null) {
        return { success: false, errorMessage: 'Wrong username' }
      } else if (userInfo.data.password == password) {
        return userInfo
      } else {
        return { success: false, errorMessage: 'Wrong password' }
      }
    }
  }

  async function handleSubmit() {
    const resp = await validateLogin(usernameInput, passwordInput)
    if (resp.success) {
      // save user info to context
      setUser({
        firstName: resp.data.firstName,
        lastName: resp.data.lastName,
        username: resp.data.username,
        email: resp.data.email,
        verified: resp.data.verified,
      })
      router.push('/profile')
    } else {
      setErrorMsg(resp.errorMessage || '')
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
            id="username"
            label="Username"
            required
            fullWidth
            style={{ marginTop: 20 }}
            onChange={(e) => {
              setUsernameInput(e.target.value)
            }}
          />
          <TextField
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
          <p style={{ color: 'red', textAlign: 'left', width: '100%' }}>
            {errorMsg && `Something went wrong: ${errorMsg}`}
          </p>
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
            Login
          </Button>
          <Link href="/signup" variant="body2" style={{ marginTop: '1rem' }}>
            {'Are you not a roombud yet? Sign up! :)'}
          </Link>
        </Box>
      </Container>
    </div>
  )
}
