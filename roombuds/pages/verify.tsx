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
import { useCallback, useState } from 'react'
import { FormTextField } from '../components/Form'
import { Navbar } from '../components/Navbar'
import { useUser } from '../utils/auth'
import { put, get, update } from '../utils/database'
import { USER_PREFERENCES_TABLE, USER_TABLE, VERIFICATION_CODE_TABLE } from '../utils/constants'
import { sendVerificationEmail } from '../utils/verification'
import { GetResponse } from '../utils/types'

const initialState = {
  orgType: '',
  org: '',
  orgDomains: [''],
  emailToVerify: ''
}

function generateCode() {
  // uhhh apparently there are edge cases where this doesn't work
  return Math.random().toString(36).substring(2, 8)
}

async function verifyCode(email: string, code: string): Promise<GetResponse> {
  const codeInfo = await get('email', email, VERIFICATION_CODE_TABLE, 'code')
  if (!codeInfo.success) {
    return { success: false, errorMessage: codeInfo.errorMessage }
  } else {
    if (codeInfo.data == null) {
      return {
        success: false,
        errorMessage: 'Verification code expired or not sent',
      }
    } else if (code == codeInfo.data) {
      return { success: true }
    } else {
      return { success: false, errorMessage: 'Wrong verification code' }
    }
  }
}

async function verifyEmail(email: string, org: string, orgType: string)
  : Promise<GetResponse> {
  // ensure fields are not empty
  if (email.length == 0 || org.length == 0) {
    return { success: false, errorMessage: 'Please choose enter your organization and email to verify.' }
  }
  // verify that domain is correct
  const split = email.split('@')
  if (split.length != 2) {
    return {
      success: false, errorMessage: `Username or domain missing from email address. 
    Please enter a valid email address for ${org}.`
    }
  }
  let domains = []
  if (orgType === 'college') {
    domains = await getCollegeDomains(org)
  } else {
    // TODO: get company domains
  }
  if (!domains.includes(split[1])) {
    return { success: false, errorMessage: `Please enter a valid email address for ${org}.` }
  }
  return { success: true }
}

async function getUserOrg(username: string, orgType: string): Promise<string> {
  const org = await get('username', username, USER_PREFERENCES_TABLE, orgType)
  if (!org.success || org.data == null) {
    return ""
  }
  return org.data
}

async function getCollegeDomains(college: string): Promise<any[]> {

  try {
    return await fetch(`http://universities.hipolabs.com/search?country=United%20States&name=${encodeURI(college)}`)
      .then((response) => response.json())
      .then((data) => {
        return data[0]['domains']
      })
  } catch (error) {
    console.log(`Unable to get domains for college ${college}: ${error}`)
    return []
  }
}

export default function VerifyPage() {
  const router = useRouter()

  const [user, setUser] = useUser()
  const [state, setState] = useState(initialState)
  const [step, setStep] = useState<number>(1);
  const [codeInput, setCodeInput] = useState('')

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
      if (state.orgType === '') {
        alert('Please choose either college or work email to verify.')
        return
      }
      state.org = await getUserOrg(user.username, state.orgType)
      if (state.org === '') {
        alert('You do not have a college/company set. Please set it in your profile before verifying.')
        return
      }
    }
    if (step == 2) {
      const emailFormatResp = await verifyEmail(state.emailToVerify, state.org, state.orgType)
      if (!emailFormatResp.success) {
        alert(emailFormatResp.errorMessage)
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
      router.push(`/profile/${user.username}`)
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
                orgType: 'college'
              }
            })}
            style={{
              backgroundColor: state.orgType === '' || state.orgType !== 'college' ? 'white' : '#c7ffd1'
            }}
          >
            <CardActionArea>
              <CardContent style={{ textAlign: 'center' }}>
                <h1>College</h1>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6} style={{ paddingLeft: '2em', }}>
          <Card
            onClick={() => setState({
              ...state, ...{
                orgType: 'company'
              }
            })}
            style={{
              backgroundColor: state.orgType === '' || state.orgType !== 'company' ? 'white' : '#c7ffd1'
            }}
          >
            <CardActionArea>
              <CardContent style={{ textAlign: 'center' }}>
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
      <Typography
        variant="h6"
        style={{ marginBottom: 20, textAlign: 'center' }}
      >
        Enter your email for <br></br>{state.org}
      </Typography>
      <FormTextField
        id="emailToVerify"
        label="email"
        value={state.emailToVerify}
        updateState={updateState}
      />
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
      {step > 1 ?
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
        : <></>
      }
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