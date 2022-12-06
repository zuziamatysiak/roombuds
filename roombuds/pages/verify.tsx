import {
  Box,
  CssBaseline,
  Container,
  Typography,
  Button,
} from '@material-ui/core'

import { useRouter } from 'next/router'
import { useCallback, useContext, useState, useEffect } from 'react'
import { FormSelect, FormTextField } from '../components/Form'
import { Navbar } from '../components/Navbar'
import { UserContext } from '../utils/auth'
import { put } from '../utils/database'
import { VERIFICATION_CODE_TABLE } from '../utils/constants'

const initialState = {
  college: '',
  verifiedEmail: '',
}

function generateCode() {
  // uhhh apparently there are edge cases where this doesn't work
  return Math.random().toString(36).substring(2, 8);
}

export default function VerifyPage() {
  const [collegeMap, setCollegeMap] = useState<any>(new Map<string, string>())
  useEffect(() => {
    try {
      fetch('http://universities.hipolabs.com/search?country=United%20States')
        .then((response) => response.json())
        .then((collegeData) => {
          var collegeDataDomains = new Map<string, string>(collegeData.map(function (
            item: any,
            _: any
          ) {
            return [item['name'], item['domains']]
          }))
          setCollegeMap(collegeDataDomains)
        })
    } catch (error) {
      console.log('Unable to connect to universities API.')
      setCollegeMap(new Map<string, string>())
    }
  }, [])

  const { user, setUser } = useContext(UserContext)
  const router = useRouter()

  const [state, setState] = useState(initialState)
  const updateState = useCallback((newState: any) => {
    setState((currentState) => ({ ...currentState, ...newState }))
  }, [])

  // TODO: work email
  const handleSubmit = async () => {
    let missing = stateChecker()
    if (missing.length == 0) {
      const split = state.verifiedEmail.split("@")
      if (split.length != 2 || !collegeMap.get(state.college)?.includes(split[1])) {
        console.log(collegeMap.get(state.college))
        alert("Please enter a valid email address for " + state.college)

      } else {
        // TODO: add expiration time
        const resp = await put({ email: user.email, code: generateCode() }, VERIFICATION_CODE_TABLE)
        if (resp.success) {
          // TODO: send email
          setUser({ ...user, ... { verifiedEmail: state.verifiedEmail } })
          router.push('/verify_code')
        } else {
          alert('Unable to send verification code at this time. Please try again later.')
        }
      }
    } else {
      alert(
        'You are missing ' +
        missing +
        '. Please fill out that field and then come back'
      )
    }
  }

  function stateChecker() {
    for (const [key, value] of Object.entries(state)) {
      if (value.length == 0) return key
    }
    return ''
  }

  return (
    <>
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
          <Typography variant="h5" style={{ marginBottom: 20 }}>Verify your account 🌱</Typography>
          <FormSelect
            id="college"
            label="Which college do you attend?"
            value={state.college}
            items={Array.from(collegeMap.keys())}
            updateState={updateState}

          />
          <FormTextField
            id="verifiedEmail"
            label="College email"
            value={state.verifiedEmail}
            updateState={updateState}
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
            Verify Email :){' '}
          </Button>
        </Box>
      </Container>
    </>
  )
}  