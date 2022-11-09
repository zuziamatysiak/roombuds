import { Navbar } from '../pages/Navbar'
import {
    CssBaseline,
    Typography,
    Button,
    Avatar,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    Container,
    ThemeProvider,
    createTheme
  } from "@material-ui/core";

const theme = createTheme();

export default function LoginPage() {
    return (
      <div>
        <Navbar />
        <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box style = {{ marginTop: 150, alignItems: 'center', display: 'flex', flexDirection: 'column'}}> 
        <Typography variant="h5">
            Login 🌱
        </Typography>
        <Box>
        <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              style = {{marginTop: 20}}
        />
        <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="outlined"
              style = {{marginTop: 20}}
        />
        <Button
              type="submit"
              fullWidth
              variant="contained"
              style = {{marginTop: 20, backgroundColor: "#459b55", color: "white"}}> Login </Button>  
        <Link href="/" variant="body2">
                  {"Are you not a roombud yet? Sign up! :)"}
        </Link>
        </Box>
        </Box>
      </Container>
    </ThemeProvider>
      </div>
    )
  }
  