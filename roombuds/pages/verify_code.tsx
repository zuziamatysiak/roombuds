import {
  Box,
  CssBaseline,
  Container,
  Typography,
  TextField,
  Button,
} from '@material-ui/core'

import { useRouter } from 'next/router'
import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useUser } from '../utils/auth'
import { get, update } from '../utils/database'
import { USER_TABLE, VERIFICATION_CODE_TABLE } from '../utils/constants'
import { GetResponse } from '../utils/types'

const validateCode = async (
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

export default function VerifyCodePage() {
  const [user, setUser] = useUser()
  const router = useRouter()

  const [codeInput, setCodeInput] = useState('')

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    const resp = await validateCode(user.email, codeInput)
    if (resp.success) {
      const userInfo = { ...user, ...{ verified: true } }
      const resp = await update(
        { verified: true },
        'email',
        user.email,
        USER_TABLE
      )
      if (resp.success) {
        setUser(userInfo)
        router.push('/profile')
      }
    } else {
      console.log(resp.errorMessage)
      alert('Please enter the correct verification code.')
      // TODO: Button to resend code
    }
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
          <Typography
            variant="h5"
            style={{ marginBottom: 20, textAlign: 'center' }}
          >
            Enter the verification code sent to {user.verifiedEmail} 🌱
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
            Verify Code :){' '}
          </Button>
        </Box>
      </Container>
    </>
  )
}