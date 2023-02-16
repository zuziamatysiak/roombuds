import {
  Box,
  Typography,
  Button,
} from '@material-ui/core'

import { useMediaQuery } from '@react-hook/media-query'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState, useEffect, Fragment } from 'react'
import { FormSelect, FormTextField } from '../components/Form'
import { Navbar } from '../components/Navbar'
import { useUser } from '../utils/auth'
import { USER_PREFERENCES_TABLE } from '../utils/constants'
import { update } from '../utils/database'

const initialState = {
  cleanliness: '',
  weed: '',
  social: '',
  weed_apartment: '',
  drugs: '',
  notice: '',
  common_space: '',
  dishes: '',
  shared_room: '',
  bathroom: '',
  leftovers: '',
  instagram: '',
  parties: '',
  atmosphere: '',
  reference_willingness: '',
  common_space_things: '',
}

const QuizzesPage = () => {
  const router = useRouter()
  const [user, setUser] = useUser()
  const [userPrefs, setUserPrefs] = useState(initialState)
  const updateState = useCallback((newState: any) => {
    setUserPrefs((currentState) => ({ ...currentState, ...newState }))
  }, [])

  const matches = useMediaQuery('(max-width: 900px)')

  const handleSubmit = async () => {
    // only update if filled in
    var prefsToUpdate = Object.fromEntries(
      Object.entries(userPrefs).filter(
        ([_, v]) => v.toString().trim().length == 0
      )
    )
    if (Object.keys(prefsToUpdate).length > 0) {
      const resp = await update(
        prefsToUpdate,
        'email',
        user?.email,
        USER_PREFERENCES_TABLE
      )
      if (!resp.success) {
        console.log(resp.errorMessage)
      }
    }
    router.push('/profile')
  }

  return (
    <>
      <Navbar />
      <Typography variant="h4" style={{ margin: '1rem' }}>
        Answer some more questions for better matches 🌱
      </Typography>
      <Box
        style={{
          padding: '1rem 3rem',
          maxWidth: !matches ? '50%' : '100%',
          margin: 'auto',
        }}
      >
        <FormSelect
          id="cleanliness"
          label="How clean are you on a scale of 1-5?"
          value={userPrefs.cleanliness}
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
          id="weed"
          label="Do you smoke weed?"
          value={userPrefs.weed}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="drugs"
          label="Do you do other drugs?"
          value={userPrefs.drugs}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="social"
          label="How often do you plan to have people over?"
          value={userPrefs.social}
          items={[
            'Never',
            'Once or twice a month',
            'Several times a week',
            'Once a week',
            'Everyday',
          ]}
          updateState={updateState}
        />
        <FormSelect
          id="weed_apartment"
          label="Do you plan on smoking weed in the apartment?"
          value={userPrefs.weed_apartment}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="notice"
          label="Should your roommate let you know if they will have people over in their room?"
          value={userPrefs.notice}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="common_space"
          label="Should your roommate tell you if they will have people over in the common space?"
          value={userPrefs.common_space}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="dishes"
          label="When do you clean the dishes?"
          value={userPrefs.dishes}
          items={[
            'Right after preparing my meal',
            'Right after I finish eating',
            'Next day',
            'Within a week',
            'I do not have a timeline on when',
          ]}
          updateState={updateState}
        />
        <FormSelect
          id="shared_room"
          label="Do you mind a shared room with your roommate at a cheaper price?"
          value={userPrefs.shared_room}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="bathroom"
          label="How much time do you spend in the bathroom in the morning?"
          value={userPrefs.bathroom}
          items={['< 5 min', '< 15 min', '< 30 min', 'more than 30 min']}
          updateState={updateState}
        />
        <FormSelect
          id="leftovers"
          label="When do you throw away leftovers?"
          value={userPrefs.leftovers}
          items={['< 5 min', '< 15 min', '< 30 min', 'more than 30 min']}
          updateState={updateState}
        />
        <FormSelect
          id="common_space_things"
          label="Should you inform your roommate before putting things in the common space?"
          value={userPrefs.common_space_things}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="parties"
          label="How many parties / month do you plan on having?"
          value={userPrefs.parties}
          items={['0', '1', '2', '< 3', 'At least once a week']}
          updateState={updateState}
        />
        <FormSelect
          id="atmosphere"
          label="Do you prefer loud or quiet atmosphere?"
          value={userPrefs.atmosphere}
          items={[
            'Quiet',
            'Loud',
            'Quiet at night, loud during the day',
            'Quiet during the day, loud at night',
            'Quiet on weekdays, loud on the weekends',
            "Don't really mind adjusting to either",
          ]}
          updateState={updateState}
        />
        <FormTextField
          id="instagram"
          label="What is your Instagram handle?"
          value={userPrefs.instagram}
          updateState={updateState}
          required={false}
        />
        <FormTextField
          id="reference_willingness"
          label="Please provide contact info to a previous roommate."
          value={userPrefs.reference_willingness}
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

export default QuizzesPage
