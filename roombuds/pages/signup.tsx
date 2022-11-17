import { Navbar } from '../components/Navbar'
import { write } from '../write'
import { useCallback, useState } from 'react'
import {
  CssBaseline,
  Typography,
  Button,
  Box,
  Container,
  Grid,
} from '@material-ui/core'
import { FormField } from '../components/Form'

const initialFormState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
}

export default function SignupPage() {
  const [state, setState] = useState(initialFormState)
  const updateState = useCallback((newState: any) => {
    setState((currentState) => ({ ...currentState, ...newState }))
  }, [])
  const handleSubmit = () => {
    write(state)
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
              <FormField
                id="firstName"
                label="First Name"
                value={state.firstName}
                updateState={updateState}
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                id="lastName"
                label="Last Name"
                value={state.lastName}
                updateState={updateState}
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                id="email"
                label="Email"
                value={state.email}
                updateState={updateState}
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
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
