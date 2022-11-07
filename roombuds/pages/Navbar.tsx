import Link from 'next/link';
import Image from 'next/image'
import {
    AppBar,
    Toolbar,
    CssBaseline,
    Typography,
    makeStyles,
  } from "@material-ui/core";

export const Navbar = () => {
  return (
    <AppBar position="static" style={{ background: '#FFFFFF' }}>
    <CssBaseline />
    <Toolbar>
      <Typography variant="h4">
        <div style = {{width: "20%", paddingTop : "5px"}}>
        <Image
            src="/logo.png"
            alt="logo"
            width = {150}
            height = {70}
        />
        </div>
      </Typography>
        <div>
            // TODO fix
          <Link href="/" style={{ color: 'black', paddingLeft : "5px"}}>
            Login
          </Link>
        </div>
    </Toolbar>
  </AppBar>
  );
};