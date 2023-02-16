import {
  Box,
  Typography,
  Button,
} from '@material-ui/core'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import { useMediaQuery } from '@react-hook/media-query'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState, useEffect, Fragment } from 'react'
import { FormSelect, FormTextField } from '../components/Form'
import { FormSelectReact } from '../components/FormSelectReact'
import { Navbar } from '../components/Navbar'
import { useUser } from '../utils/auth'
import { USER_PREFERENCES_TABLE } from '../utils/constants'
import { put } from '../utils/database'
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { hobbiesList } from '../public/hobbies_list'

const initialState = {
  loc_state: '',
  loc_city: '',
  budget: '',
  college: '',
  company: '',
  cigarettes: '',
  alcohol: '',
  wakeuptime: '',
  bedtime: '',
  trash: '',
  hobbies: '',
  hobb: [''],
}

export default function OnboardPage() {
  const [selectedHobbies, setSelectedHobbies] = useState()
  const [selectedWakeDate, setSelectedWakeDate] =
    useState<MaterialUiPickersDate>(new Date('2014-08-18T21:11:54'))
  const [selectedBedDate, setSelectedBedDate] = useState<MaterialUiPickersDate>(
    new Date('2014-08-18T21:11:54')
  )
  function handleHobbies(data: any) {
    if (data.length <= 3) {
      let l: string[] = []
      data.forEach(function (value: any) {
        l.push(value.label)
      })
      setSelectedHobbies(data)
      state.hobb = l
      // TODO: change to actually display hobbies correctly
      let s: string = ''
      l.forEach(function (val: string) {
        s += val + ' '
      })
      state.hobbies = s
    }
  }

  const handleWakeDateChange = (date: MaterialUiPickersDate) => {
    setSelectedWakeDate(date)
    state.wakeuptime = '' + date?.getHours()
  }
  const handleBedDateChange = (date: MaterialUiPickersDate) => {
    setSelectedBedDate(date)
    state.bedtime = '' + date?.getHours()
  }
  const [collegeList, setCollegeList] = useState([])
  const [selectedCollege, setSelectedCollege] = useState()
  function handleCollege(data: any) {
    setSelectedCollege(data)
    state.college = data.label
  }
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])
  const [selectedLocState, setSelectedLocState] = useState()
  function handleLocState(data: any) {
    setSelectedLocState(data)
    state.loc_state = data.label

    try {
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        body: JSON.stringify({ country: 'United States', state: data.label }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((cityData) => {
          var cities = cityData['data'].map(function (city: any, index: any) {
            return { value: index, label: city }
          })
          console.log(cities)
          setCityList(cities)
        })
    } catch {
      console.log('Unable to connect to cities API.')
    }
  }

  const [selectedLocCity, setSelectedLocCity] = useState()
  function handleLocCity(data: any) {
    setSelectedLocCity(data)
    state.loc_city = data.label
  }
  useEffect(() => {
    try {
      fetch('http://universities.hipolabs.com/search?country=United%20States')
        .then((response) => response.json())
        .then((collegeData) => {
          var collegeDataNames = collegeData.map(function (
            item: any,
            index: any
          ) {
            return { value: index, label: item['name'] }
          })
          setCollegeList(collegeDataNames)
        })
    } catch (error) {
      console.log('Unable to connect to universities API.')
      setCollegeList([])
    }

    try {
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        body: JSON.stringify({ country: 'United States' }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((stateData) => {
          var states = stateData['data']['states'].map(function (
            item: any,
            index: any
          ) {
            return { value: index, label: item['name'] }
          })
          setStateList(states)
        })
    } catch {
      console.log('Unable to connect to states API.')
      setStateList([])
    }
  }, [])

  const [user, setUser] = useUser()
  const router = useRouter()

  const [state, setState] = useState(initialState)
  const updateState = useCallback((newState: any) => {
    setState((currentState) => ({ ...currentState, ...newState }))
  }, [])

  const matches = useMediaQuery('(max-width: 900px)')

  // TODO: form validation
  const handleSubmit = async () => {
    let missing = stateChecker()
    if (missing.length == 0) {
      const prefs = { email: user?.email, ...state }
      const resp = await put(prefs, USER_PREFERENCES_TABLE)
      if (resp.success) {
        router.push('/profile')
      }
    } else {
      alert(
        'You are missing ' +
          missing +
          '. Please fill out that field and then come back'
      )
    }
  }
  console.log(matches)
  function stateChecker() {
    for (const [key, value] of Object.entries(state)) {
      if (value.length == 0) return key
    }
    return ''
  }
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
        <FormSelectReact
          options={stateList}
          label="Which state are you moving to?"
          value={selectedLocState}
          updateState={handleLocState}
          placeholder={'Search for your state...'}
          isMulti={false}
        />
        <FormSelectReact
          options={cityList}
          label="Which city are you moving to?"
          value={selectedLocCity}
          updateState={handleLocCity}
          placeholder={'Search for your city...'}
          isMulti={false}
        />
        <FormSelect
          id="budget"
          label="What is your budget?"
          value={state.budget}
          items={[
            '< $800',
            '$800 - $1200',
            '$1200 - $1500',
            '$1500 - $2000',
            '$2000 - $3500',
            '$3500+',
          ]}
          updateState={updateState}
        />
        <FormSelectReact
          options={collegeList}
          label="Where did you go to college?"
          value={selectedCollege}
          updateState={handleCollege}
          placeholder={'Search for your college...'}
          isMulti={false}
        />
        <FormTextField
          id="company"
          label="What company do you work for?"
          value={state.company}
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
          id="alcohol"
          label="Do you drink alcohol?"
          value={state.alcohol}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker
            autoOk
            fullWidth
            label="What time do you wake up?"
            value={selectedWakeDate}
            style={{ marginBottom: '1rem' }}
            onChange={handleWakeDateChange}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker
            autoOk
            fullWidth
            label="What time do you go to sleep?"
            value={selectedBedDate}
            onChange={handleBedDateChange}
          />
        </MuiPickersUtilsProvider>
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
        <FormSelectReact
          options={hobbiesList}
          label="What are your hobbies?"
          value={selectedHobbies}
          updateState={handleHobbies}
          placeholder={'Pick up to 3...'}
          isMulti={true}
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
