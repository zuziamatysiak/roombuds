import React, { useEffect, useState } from 'react'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import { useRouter } from 'next/router'
import { FormSelect, FormTextField } from '../components/Form'
import { FormSelectReact } from '../components/FormSelectReact'
import { useUser } from '../utils/auth'
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { hobbiesList } from '../public/hobbies_list'

export const OnboardQuestionnaire = ({ state, updateState }: any) => {
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

  return (
    <>
      <FormTextField
        id="age"
        label="How old are you?"
        type="number"
        value={state.age}
        updateState={updateState}
      />
      <FormTextField
        id="gender"
        label="What is your gender?"
        value={state.gender}
        updateState={updateState}
      />
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
      <FormSelectReact
        options={hobbiesList}
        label="What are your hobbies?"
        value={selectedHobbies}
        updateState={handleHobbies}
        placeholder={'Pick up to 3...'}
        isMulti={true}
      />
      <FormTextField
        id="instagram"
        label="What is your Instagram handle?"
        value={state.instagram}
        updateState={updateState}
        required={false}
      />
      <FormTextField
        id="reference_willingness"
        label="Please provide contact info to a previous roommate."
        value={state.reference_willingness}
        updateState={updateState}
        required={false}
      />
    </>
  )
}
