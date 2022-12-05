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
  MenuItem,
  Button,
} from '@material-ui/core'

import {useMediaQuery, useMediaQueries} from '@react-hook/media-query'
import Select from "react-select";
import { PinpointEmail } from 'aws-sdk'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState, useEffect, Fragment } from 'react'
import { FormSelect, FormTextField } from '../components/Form'
import { FormSelectReact } from '../components/FormSelectReact'
import { Navbar } from '../components/Navbar'
import { UserContext } from '../utils/auth'
import { USER_PREFERENCES_TABLE } from '../utils/constants'
import { put } from '../utils/database'
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { hobbiesList } from '../public/hobbies_list'
import { validateHeaderValue } from 'http';
import { matchesMiddleware } from 'next/dist/shared/lib/router/router';

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
  hobb: [''],
}

export default function OnboardPage() {
  const [selectedHobbies, setSelectedHobbies] = useState();
  const [selectedWakeDate, setSelectedWakeDate] = useState(new Date('2014-08-18T21:11:54'));
  const [selectedBedDate, setSelectedBedDate] = useState(new Date('2014-08-18T21:11:54'));
  function handleHobbies(data : any) {
    if (data.length <= 3) {
      let l : string[] = []
      data.forEach(function (value : any) {
        l.push(value.label)
      }); 
      setSelectedHobbies(data);
      state.hobb = l;
      // TODO: change to actually display hobbies correctly
      let s : string = ""
      l.forEach(function (val : string){
        s += val + " "
      });
      state.hobbies = s
    } 
  }

  const handleWakeDateChange = (date : Date) => {
    setSelectedWakeDate(date);
    state.wakeuptime = '' + date.getHours();
  };
  const handleBedDateChange = (date : Date) => {
    setSelectedBedDate(date);
    state.bedtime = '' + date.getHours();
  };
  const [collegeList, setCollegeList] = useState([])
  const [cityList, setCityList] = useState([])
  useEffect(() => {
    try {
      fetch('http://universities.hipolabs.com/search?country=United%20States')
      .then(response => response.json())
      .then(collegeData => {
        var collegeDataNames = collegeData.map(function(item : any,index : any){
          return item["name"];
        })
        setCollegeList(collegeDataNames)});
    }
    catch (error) {
      console.log("Unable to connect to universities API.")
      setCollegeList([])
    }

    try {
      fetch('https://countriesnow.space/api/v0.1/countries')
        .then(response => response.json())
        .then(cityData => {
          cityData["data"].map(function(item : any,index : any){
            if (item["country"] == "United States") {
              setCityList(item["cities"])
            }
          })
          });
    }
    catch {
      console.log("Unable to connect to cities API.")
      setCityList([])
    }
  }, []);
  const { user, setUser } = useContext(UserContext)
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
      const prefs = { email: user.email, ...state }
      const resp = await put(prefs, USER_PREFERENCES_TABLE)
      if (resp.success) {
        // redirect to onboard page
        router.push('/dashboard')
      }
    } else {
      alert("You are missing " + missing + ". Please fill out that field and then come back")
    }
  }
  console.log(matches)
  function stateChecker() {
    for (const [key, value] of Object.entries(state)) {
      if (value.length == 0) return key
    }
    return ""
  }
  return (
    <>
      <Navbar />
      <Typography variant="h4" style={{ margin: '1rem' }}>
        👋 Welcome {user?.firstName} {user?.lastName}
      </Typography>
        <Box style={{ padding: '1rem 3rem', maxWidth: !matches ? '50%' : '100%', margin: 'auto'}}>
        <FormSelect
          id="location"
          label="Where are you moving to?"
          value={state.location}
          items={cityList}
          updateState={updateState}
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
        <FormSelect
          id="college"
          label="Where did you go to college?"
          value={state.college}
          items={collegeList}
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
          id="drugs"
          label="Do you do other drugs?"
          value={state.drugs}
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker 
            autoOk 
            fullWidth
            label="What time do you wake up?" 
            value={selectedWakeDate} 
            style={{ marginBottom: '1rem' }}
            onChange={handleWakeDateChange} />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker 
            autoOk 
            fullWidth
            label="What time do you go to sleep?" 
            value={selectedBedDate} 
            onChange={handleBedDateChange} />
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
          label="What are your hobbies? Pick up to 3."
          value={selectedHobbies}
          updateState={handleHobbies}
          items={hobbiesList}
        />
        <FormSelect
          id="weed_apartment"
          label="Do you plan on smoking weed in the apartment?"
          value={state.weed_apartment}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="notice"
          label="Should your roommate let you know if they will have people over in their room?"
          value={state.notice}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="common_space"
          label="Should your roommate tell you if they will have people over in the common space?"
          value={state.common_space}
          items={['Yes', 'No']}
          updateState={updateState}
        />
        <FormSelect
          id="dishes"
          label="When do you clean the dishes?"
          value={state.dishes}
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
          value={state.shared_room}
          items={[
            'Yes',
            'No'
          ]}
          updateState={updateState}
        />
        <FormSelect
          id="bathroom"
          label="How much time do you spend in the bathroom in the morning?"
          value={state.bathroom}
          items={[
            '< 5 min',
            '< 15 min',
            '< 30 min',
            'more than 30 min'
          ]}
          updateState={updateState}
        />
        <FormSelect
          id="leftovers"
          label="When do you throw away leftovers?"
          value={state.leftovers}
          items={[
            '< 5 min',
            '< 15 min',
            '< 30 min',
            'more than 30 min'
          ]}
          updateState={updateState}
        />
        <FormSelect
          id="common_space_things"
          label="Should you inform your roommate before putting things in the common space?"
          value={state.common_space_things}
          items={[
            'Yes',
            'No'
          ]}
          updateState={updateState}
        />
        <FormSelect
          id="parties"
          label="How many parties / month do you plan on having?"
          value={state.parties}
          items={[
            '0',
            '1',
            '2',
            '< 3',
            'At least once a week'
          ]}
          updateState={updateState}
        />
        <FormSelect
          id="atmosphere"
          label="Do you prefer loud or quiet atmosphere?"
          value={state.atmosphere}
          items={[
            'Quiet',
            'Loud',
            'Quiet at night, loud during the day',
            'Quiet during the day, loud at night',
            "Quiet on weekdays, loud on the weekends",
            "Don't really mind adjusting to either"
          ]}
          updateState={updateState}
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
