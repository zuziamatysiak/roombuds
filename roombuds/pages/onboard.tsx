import { Box, Typography, Button, useMediaQuery } from '@material-ui/core'

import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useUser } from '../utils/auth'
import { USER_PREFERENCES_TABLE } from '../utils/constants'
import { put } from '../utils/database'
import { OnboardQuestionnaire } from '../components/OnboardQuestionnaire'

const initialState = {
  age: '',
  gender: '',
  loc_state: '',
  loc_city: '',
  budget: '',
  college: '',
  company: '',
  cigarettes: '',
  alcohol: '',
  wakeuptime: '',
  bedtime: '',
  hobbies: '',
  hobb: [''],
  instagram: '',
  reference_willingness: '',
}

export default function OnboardPage() {
  const [user] = useUser()
  const router = useRouter()
  const [state, setState] = useState(initialState)
  const updateState = useCallback((newState: any) => {
    setState((currentState) => ({ ...currentState, ...newState }))
  }, [])

  function stateChecker() {
    for (const [key, value] of Object.entries(state)) {
      if (value.length == 0) return key
    }
    return ''
  }

  const handleSubmit = async () => {
    let missing = stateChecker()
    if (missing.length == 0) {
      const prefs = { username: user?.username, ...state }
      const resp = await put(prefs, USER_PREFERENCES_TABLE)
      if (resp.success) {
        router.push(`/profile/${user?.username}`)
      }
    } else {
      alert(
        'You are missing ' +
          missing +
          '. Please fill out that field and then come back'
      )
    }
  }

  const matches = useMediaQuery('(max-width: 900px)')

  return (
    <>
      <Navbar />
      <Typography variant="h4" style={{ margin: '1rem' }}>
        👋 Welcome {user?.firstName} {user?.lastName}
      </Typography>
      <Box
        style={{
          padding: '1rem 3rem',
          maxWidth: !matches ? '50%' : '100%',
          margin: 'auto',
        }}
      >
        <OnboardQuestionnaire state={state} updateState={updateState} />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          style={{
            margin: '1.5rem 0',
            backgroundColor: '#459b55',
            color: 'white',
          }}
        >
          Submit
        </Button>
      </Box>
    </>
  )
}
