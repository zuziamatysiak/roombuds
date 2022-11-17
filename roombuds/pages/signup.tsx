import { Navbar } from '../components/Navbar'
import { put } from '../utils/database'
import { useCallback, useContext, useState } from 'react'
import {
  CssBaseline,
  Typography,
  Button,
  Box,
  Container,
  Grid,
} from '@material-ui/core'
import { FormTextField } from '../components/Form'
import { USER_TABLE } from '../utils/constants'
import { useRouter } from 'next/router'
import { UserContext } from '../utils/auth'

const initialFormState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
}

export default function SignupPage() {
  const context = useContext(UserContext)

  const router = useRouter()
  const [state, setState] = useState(initialFormState)
  const updateState = useCallback((newState: any) => {
    setState((currentState) => ({ ...currentState, ...newState }))
  }, [])

  const handleSubmit = async () => {
    const resp = await put(state, USER_TABLE)
    if (resp.success) {
      // save user info to context
      context.setUser({
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
      })

      // redirect to onboard page
      router.push('/onboard')
    }
    //  TODO: show error message if signup is unsuccessful
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
            <Grid item xs={12}>
              <FormTextField
                id="email"
                label="Email"
                value={state.email}
                updateState={updateState}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                id="password"
                label="Password"
                value={state.password}
                updateState={updateState}
              />
            </Grid>
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
