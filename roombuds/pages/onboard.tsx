import {
  Box,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core'
import { PinpointEmail } from 'aws-sdk'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { FormSelect, FormTextField } from '../components/Form'
import { Navbar } from '../components/Navbar'
import { UserContext } from '../utils/auth'
import { USER_PREFERENCES_TABLE } from '../utils/constants'
import { put } from '../utils/database'

const initialState = {
  location: '',
  budget: '',
  college: '',
  company: '',
  cleanliness: '',
  cigarettes: '',
  weed: '',
  alcohol: '',
  social: '',
  wakeuptime: '',
  bedtime: '',
  trash: '',
  hobbies: '',
}

export default function OnboardPage() {
  const { user, setUser } = useContext(UserContext)
  const router = useRouter()

  const [state, setState] = useState(initialState)
  const updateState = useCallback((newState: any) => {
    setState((currentState) => ({ ...currentState, ...newState }))
  }, [])

  // TODO: form validation
  const handleSubmit = async () => {
    const prefs = { email: user.email, ...state }
    const resp = await put(prefs, USER_PREFERENCES_TABLE)
    if (resp.success) {
      // redirect to onboard page
      router.push('/dashboard')
    }
  }

  return (
    <>
      <Navbar />
      <Typography variant="h4" style={{ margin: '1rem' }}>
        👋 Welcome {user?.firstName} {user?.lastName}
      </Typography>
      <Box style={{ padding: '1rem 3rem', maxWidth: '50%', margin: 'auto' }}>
        <FormTextField
          id="location"
          label="Where are you moving to?"
          value={state.location}
          updateState={updateState}
        />
        <FormSelect
          id="budget"
          label="What is your budget?"
          value={state.budget}
          items={[
            '< $800',
            '800 - 1200',
            '1200 - 1500',
            '1500 - 2000',
            '2000 - 3500',
            '3500+',
          ]}
          updateState={updateState}
        />
        <FormTextField
          id="college"
          label="Where did you go to college?"
          value={state.college}
          updateState={updateState}
        />
        <FormTextField
          id="company"
          label="What company do you work for?"
          value={state.company}
          updateState={updateState}
        />
        <FormSelect
          id="cleanliness"
          label="How clean are you on a scale of 1-5?"
          value={state.cleanliness}
          items={[
            { value: 1, label: '1 (does not clean)' },
            { value: 2, label: '2 (cleans once a month)' },
            { value: 3, label: '3 (cleans usually once a week)' },
            { value: 4, label: '4 (cleans at least twice a week)' },
            { value: 5, label: '5 (cleans everyday)' },
          ]}
          updateState={updateState}
        />
        <FormSelect
          id="cigarettes"
          label="Do you smoke cigarettes?"
          value={state.cigarettes}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="weed"
          label="Do you smoke weed?"
          value={state.weed}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="alcohol"
          label="Do you drink alcohol?"
          value={state.alcohol}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="social"
          label="How often do you plan to have people over?"
          value={state.social}
          items={[
            'Never',
            'Once or twice a month',
            'Several times a week',
            'Once a week',
            'Everyday',
          ]}
          updateState={updateState}
        />
        <FormTextField
          id="wakeuptime"
          label="What time do you wake up?"
          value={state.wakeuptime}
          updateState={updateState}
          required={false}
        />
        <FormTextField
          id="bedtime"
          label="What time do you go to sleep?"
          value={state.bedtime}
          updateState={updateState}
          required={false}
        />
        <FormSelect
          id="trash"
          label="How often do you throw out the trash?"
          value={state.trash}
          items={[
            'Never',
            'Once or twice a month',
            'Several times a week',
            'Once a week',
            'Everyday',
          ]}
          updateState={updateState}
        />
        <FormTextField
          id="hobbies"
          label="What are your hobbies?"
          value={state.hobbies}
          updateState={updateState}
          required={false}
        />
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
