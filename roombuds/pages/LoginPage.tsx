import { Navbar } from '../pages/Navbar'
import {read} from "../read" 
import {
    CssBaseline,
    Typography,
    Button,
    TextField,
    Link,
    Box,
    Container,
    ThemeProvider,
    createTheme
  } from "@material-ui/core";
import {useState} from 'react';

export default function LoginPage() {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPassInput] = useState('');
  function handleSubmit(props: any) {
    read(emailInput, passwordInput)
  }  
    return (
      <div>
        <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box style = {{ marginTop: 150, alignItems: 'center', display: 'flex', flexDirection: 'column'}}> 
        <Typography variant="h5">
            Login 🌱
        </Typography>
        <TextField
            //   variant="outlined" TODO: fix potentially
              id="email"
              label="Email Address"
              required
              fullWidth
              style = {{marginTop: 20}}
              onChange={(e) => {
                setEmailInput(e.target.value)
              }}
        />
        <TextField
            //   variant="outlined"
              label="Password"
              type="password"
              id="password"
              required
              fullWidth
              style = {{marginTop: 20}}
              onChange={(e) => {
                setPassInput(e.target.value)
              }}
        />
        <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick = {handleSubmit}
              style = {{marginTop: 20, backgroundColor: "#459b55", color: "white"}}> Login </Button>  
        <Link href="/SignupPage" variant="body2">
                  {"Are you not a roombud yet? Sign up! :)"}
        </Link>
        </Box>
      </Container>
      </div>
    )
  }
  