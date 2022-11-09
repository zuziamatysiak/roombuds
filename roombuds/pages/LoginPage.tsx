import { Navbar } from '../pages/Navbar'
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


export default function LoginPage() {
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
        />
        <TextField
            //   variant="outlined"
              label="Password"
              type="password"
              id="password"
              required
              fullWidth
              style = {{marginTop: 20}}
        />
        <Button
              type="submit"
              fullWidth
              variant="contained"
              style = {{marginTop: 20, backgroundColor: "#459b55", color: "white"}}> Login </Button>  
        <Link href="/SignupPage" variant="body2">
                  {"Are you not a roombud yet? Sign up! :)"}
        </Link>
        </Box>
      </Container>
      </div>
    )
  }
  