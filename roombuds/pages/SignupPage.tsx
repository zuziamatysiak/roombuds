import { Navbar } from '../pages/Navbar'
import {write} from "../write" 
import {useState} from 'react';
import {
    CssBaseline,
    Typography,
    Button,
    TextField,
    Box,
    Container,
  } from "@material-ui/core";

export default function SignupPage() {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPassInput] = useState('');
  function handleSubmit(props: any) {
    write(emailInput, passwordInput)
  }  
    return (
        <div>
        <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box style = {{ marginTop: 150, alignItems: 'center', display: 'flex', flexDirection: 'column'}}> 
        <Typography variant="h5">
            Signup 🌱
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
              style = {{marginTop: 20, backgroundColor: "#459b55", color: "white"}}> Sign me up! :) </Button>  
        </Box>
      </Container>
      </div>
    )
}