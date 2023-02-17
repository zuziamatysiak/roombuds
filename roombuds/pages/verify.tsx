import {
  Box,
  CardContent,
  CssBaseline,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
} from '@material-ui/core'
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';

import { useRouter } from 'next/router'
import { useCallback, useState, useEffect } from 'react'
import { FormSelectReact } from '../components/FormSelectReact'
import { FormTextField } from '../components/Form'
import { Navbar } from '../components/Navbar'
import { useUser } from '../utils/auth'
import { put, get, update } from '../utils/database'
import { USER_TABLE, VERIFICATION_CODE_TABLE } from '../utils/constants'
import { sendVerificationEmail } from '../utils/verification'
import { GetResponse } from '../utils/types'

const initialState = {
  isCollege: '',
  org: '',
  emailToVerify: ''
}

function generateCode() {
  // uhhh apparently there are edge cases where this doesn't work
  return Math.random().toString(36).substring(2, 8)
}

const verifyCode = async (
  email: string,
  code: string
): Promise<GetResponse> => {
  const codeInfo = await get('email', email, VERIFICATION_CODE_TABLE)
  if (!codeInfo.success) {
    return { success: false, errorMessage: codeInfo.errorMessage }
  } else {
    if (codeInfo.data == null) {
      return {
        success: false,
        errorMessage: 'Verification code expired or not sent',
      }
    } else if (code == codeInfo.data.code) {
      return { success: true }
    } else {
      return { success: false, errorMessage: 'Wrong verification code' }
    }
  }
}

export default function VerifyPage() {
  const [collegeMap, setCollegeMap] = useState<any>(new Map<string, string>())
  const [collegeList, setCollegeList] = useState([])
  useEffect(() => {
    try {
      fetch('http://universities.hipolabs.com/search?country=United%20States')
        .then((response) => response.json())
        .then((collegeData) => {
          var collegeDataDomains = new Map<string, string>(
            collegeData.map(function (item: any, _: any) {
              return [item['name'], item['domains']]
            })
          )
          setCollegeMap(collegeDataDomains)
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
      setCollegeMap(new Map<string, string>())
      setCollegeList([])
    }
  }, [])

  // TODO: Populate
  const companyMap = new Map<string, string>()
  companyMap.set("Company 1", "company1.com")
  companyMap.set("Company 2", "company2.com")
  const companyList = [{ value: 0, label: "Company 1" }, { value: 1, label: "Company 2" }]

  const [user, setUser] = useUser()
  const router = useRouter()

  const [state, setState] = useState(initialState)
  const [step, setStep] = useState<number>(1);
  const [codeInput, setCodeInput] = useState('')
  const [selectedOrg, setSelectedOrg] = useState()
  function handleOrg(data: any) {
    setSelectedOrg(data)
    state.org = data.label
  }

  const updateState = useCallback((newState: any) => {
    setState((currentState) => ({ ...currentState, ...newState }))
  }, [])

  const handlePrev = () => {
    setStep(step - 1 > 0 ? step - 1 : 1)
  }
  const handleNext = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (step == 1) {
      // user has chosen either college/work to verify
      // ensure they have chosen one
      if (state.isCollege == null) {
        alert('Please choose either college or work email to verify.')
        return
      }
    }
    if (step == 2) {
      // user has searched for college/work and inputted their email. 
      // ensure fields are not empty
      if (state.emailToVerify.length == 0 || state.org.length == 0) {
        alert('Please choose enter your organization and email to verify.')
        return
      }
      // verify that domain is correct
      const split = state.emailToVerify.split('@')
      if (split.length != 2) {
        alert('Please enter a valid email address for ' + state.org)
        return
      }
      var domainsMap = new Map<string, string>()
      if (state.isCollege) {
        domainsMap = collegeMap
      } else {
        domainsMap = companyMap
      }
      if (!domainsMap.get(state.org)?.includes(split[1])) {
        alert('Please enter a valid email address for ' + state.org)
        return
      }
      // TODO: add expiration time
      const code = generateCode()
      const resp = await put({ email: user.email, code: code }, VERIFICATION_CODE_TABLE)
      if (!resp.success) {
        alert('Unable to generate verification code at this time. Please try again later.')
        return
      }
      const emailResp = await sendVerificationEmail(state.emailToVerify, code)
      if (!emailResp.success) {
        alert('Unable to send verification code at this time. Please try again later.')
        return
      }
    }
    if (step == 3) {
      // User has inputted verification code.
      if (codeInput.length == 0) {
        alert('Please enter the verification code.')
        return
      }
      const verifyResp = await verifyCode(user.email, codeInput)
      if (!verifyResp.success) {
        console.log(verifyResp.errorMessage)
        alert('Please enter the correct verification code.')
        return
      }

      const updateResp = await update({ verified: true }, 'email', user.email, USER_TABLE)
      if (!updateResp.success) {
        console.log(updateResp.errorMessage)
        alert('Unable to verify email at this time. Please try again later.')
        return
      }
      const userInfo = { ...user, ... { verified: true } }
      setUser(userInfo)
      router.push('/profile')
      return
    }
    setStep(step + 1)
  }

  const step1 = (
    <div>
      <Typography
        variant="h6"
        style={{ marginBottom: 20, textAlign: 'center' }}
      >
        Through which email would you like to verify your account?
      </Typography>
      <Grid container>
        <Grid item xs={6} style={{ paddingRight: '2em', }}>
          <Card
            onClick={() => setState({
              ...state, ...{
                isCollege: state.isCollege === '' ? 'true' : state.isCollege === 'false' ? 'true' : 'true'
              }
            })}
            style={{
              backgroundColor: state.isCollege === '' || state.isCollege == 'false' ? 'white' : '#c7ffd1'
            }}
          >
            <CardActionArea>
              <CardContent>
                <h1>College</h1>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6} style={{ paddingLeft: '2em', }}>
          <Card
            onClick={() => setState({
              ...state, ...{
                isCollege: state.isCollege === '' ? 'true' : state.isCollege === 'false' ? 'false' : 'false'
              }
            })}
            style={{
              backgroundColor: state.isCollege === 'false' ? '#c7ffd1' : 'white'
            }}
          >
            <CardActionArea>
              <CardContent>
                <h1>Work</h1>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </div >
  )

  const step2 = (
    <Container component="main" maxWidth="xs">
      {state.isCollege === 'true' ?
        <div>
          <FormSelectReact
            options={collegeList}
            label="Where did you go to college?"
            value={selectedOrg}
            updateState={handleOrg}
            placeholder={'Search for your college...'}
            isMulti={false}
          />
          <FormTextField
            id="emailToVerify"
            label="College email"
            value={state.emailToVerify}
            updateState={updateState}
          />
        </div>
        :
        <div>
          <FormSelectReact
            options={companyList}
            label="Where do you work?"
            value={selectedOrg}
            updateState={handleOrg}
            placeholder={'Search for your company...'}
            isMulti={false}
          />
          <FormTextField
            id="emailToVerify"
            label="Corporate email"
            value={state.emailToVerify}
            updateState={updateState}
          />
        </div>
      }
    </Container>
  )

  const step3 = (
    <div>
      <Typography
        variant="h6"
        style={{ marginBottom: 20, textAlign: 'center' }}
      >
        Enter the verification code sent to {state.emailToVerify}
      </Typography>
      <TextField
        id="code"
        onChange={(e) => {
          setCodeInput(e.target.value)
        }}
        margin="normal"
        inputProps={{
          style: { fontSize: 40, textAlign: 'center' },
          maxLength: 6,
        }}
        InputLabelProps={{ style: { fontSize: 40, textAlign: 'center' } }}
      />
    </div>
  )

  const nextPrevButtons = (
    <div style={{ display: 'flex' }}>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handlePrev}
        style={{
          marginTop: '3em',
          marginRight: '1em',
          backgroundColor: '#459b55',
          color: 'white',
        }}
      >
        Previous
      </Button>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleNext}
        style={{
          marginTop: '3em',
          marginLeft: '1em',
          backgroundColor: '#459b55',
          color: 'white',
        }}
      >
        Next
      </Button>
    </div>
  )

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
          <Typography variant="h5" style={{ marginBottom: 20 }}>
            Verify your account 🌱
          </Typography>
          {step == 1 ? step1 : step == 2 ? step2 : step3}
          {nextPrevButtons}
        </Box>
      </Container>
    </>
  )
}  