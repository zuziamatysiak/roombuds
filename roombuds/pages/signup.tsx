import { Navbar } from '../components/Navbar'
import { get, put } from '../utils/database'
import { useCallback, useState } from 'react'
import {
  CssBaseline,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  TextField,
} from '@material-ui/core'
import { FormTextField } from '../components/Form'
import {
  USER_TABLE,
  RANDOM_PATH,
  USER_PROFILE_PICTURES,
} from '../utils/constants'
import { useRouter } from 'next/router'
import { USERNAME_KEY, useUser } from '../utils/auth'

const initialFormState = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  verified: false,
}

export default function SignupPage() {
  const [user, setUser] = useUser()
  const [errorMsg, setErrorMsg] = useState<any>({
    username: '',
    email: '',
    password: '',
    misc: '',
  })

  const router = useRouter()
  const [state, setState] = useState(initialFormState)
  const updateState = useCallback((newState: any) => {
    setState((currentState) => ({ ...currentState, ...newState }))
  }, [])

  // checks that username is not already taken
  const validateUsername = async (username: string) => {
    if (username) {
      const resp = await get(USERNAME_KEY, username, USER_TABLE)
      if (resp.success && resp.data) {
        setErrorMsg({ ...errorMsg, username: 'Username already exists' })
      } else if (!resp.success) {
        setErrorMsg({ ...errorMsg, username: resp.errorMessage })
      } else {
        setErrorMsg({ ...errorMsg, username: '' })
      }
    } else {
      setErrorMsg({ ...errorMsg, username: '' })
    }
  }

  // checks that email is valid
  const validateEmail = (email: string) => {
    const validEmail = String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    if (validEmail) {
      setErrorMsg({ ...errorMsg, email: '' })
    } else {
      setErrorMsg({ ...errorMsg, email: 'Invalid email' })
    }
  }

  // checks that password is at least 8 characters
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setErrorMsg({
        ...errorMsg,
        password: 'Password must be at least 8 characters',
      })
    } else {
      setErrorMsg({ ...errorMsg, password: '' })
    }
  }

  const handleSubmit = async () => {
    const resp = await put(state, USER_TABLE)
    if (resp.success) {
      // save user info to context
      setUser({
        username: state.username,
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        verified: state.verified,
      })

      // redirect to onboard page
      router.push('/onboard')
    } else {
      setErrorMsg({ ...errorMsg, misc: resp.errorMessage })
    }

    const pic = { username: state.username, profilePicPath: RANDOM_PATH }
    put(pic, USER_PROFILE_PICTURES)
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
          <Typography variant="h5">Signup 🌱</Typography>
          <p style={{ color: 'red', textAlign: 'left', width: '100%' }}>
            {errorMsg.misc}
          </p>
          <Grid container>
            <Grid item xs={6}>
              <FormTextField
                id="firstName"
                label="First Name"
                value={state.firstName}
                updateState={updateState}
              />
            </Grid>
            <Grid item xs={6}>
              <FormTextField
                id="lastName"
                label="Last Name"
                value={state.lastName}
                updateState={updateState}
              />
            </Grid>
            <TextField
              id="username"
              label="Username"
              value={state.username}
              required
              fullWidth
              onChange={(e) => {
                validateUsername(e.target.value)
                updateState({ ['username']: e.target.value })
              }}
              style={{ marginBottom: '1rem' }}
              error={errorMsg.username ? true : false}
              helperText={errorMsg.username || ''}
            />
            <TextField
              id="email"
              label="Email"
              value={state.email}
              required
              fullWidth
              onChange={(e) => {
                validateEmail(e.target.value)
                updateState({ ['email']: e.target.value })
              }}
              style={{ marginBottom: '1rem' }}
              error={errorMsg.email ? true : false}
              helperText={errorMsg.email || ''}
            />
            <TextField
              id="password"
              label="Password"
              value={state.password}
              type="password"
              required
              fullWidth
              onChange={(e) => {
                validatePassword(e.target.value)
                updateState({ ['password']: e.target.value })
              }}
              style={{ marginBottom: '1rem' }}
              error={errorMsg.password ? true : false}
              helperText={errorMsg.password || ''}
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
              Sign me up! :){' '}
            </Button>
          </Grid>
        </Box>
      </Container>
    </div>
  )
}
