import {
    Box,
    CssBaseline,
    Container,
    Typography,
    TextField,
    Button,
  } from '@material-ui/core'

import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { UserContext } from '../utils/auth'
import { update } from '../utils/database'
import { USER_TABLE } from '../utils/constants'
import { GetResponse } from '../utils/types'

const validateCode = async (
    code: string
  ): Promise<GetResponse> => {
    // TODO: Actually verify code
    console.log("Correct verification code: " + code)
    return {success: true}
}

export default function VerifyCodePage() {
    const { user, setUser } = useContext(UserContext)
    const router = useRouter()

    const [codeInput, setCodeInput] = useState('')

    const handleSubmit = async () => {
        const resp = await validateCode(codeInput)
        if (resp.success) {
            const userInfo = {...user,...{verified: true}}
            const resp = await update({verified: true}, 'email', user.email, USER_TABLE)
            if (resp.success) {
                setUser(userInfo)
                router.push('/dashboard')
            }
        } else {
            alert('Please enter the correct verification code.')
            // TODO: Button to resend code
        }
    }

    return (
        <>
        <Navbar />
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box style={{
            marginTop: 150,
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
        }}>
        <Typography variant="h5" style={{ marginBottom: 20, textAlign: 'center'}}>Enter verification code sent to {user.verifiedEmail} 🌱</Typography>
            <TextField
                id="code"
                onChange={(e) => {
                    setCodeInput(e.target.value)
                }}
                margin="normal"
                inputProps={{style: {fontSize: 40, textAlign: 'center'}, maxLength: 6}}
                InputLabelProps={{style: {fontSize: 40, textAlign: 'center'}}} 
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