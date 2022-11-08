import Link from 'next/link';
import Image from 'next/image'
import {
    AppBar,
    Toolbar,
    CssBaseline,
    Typography,
    Button
  } from "@material-ui/core";

export const Navbar = () => {
  return (
    <AppBar position="static" style={{ background: '#FFFFFF' }}>
    <CssBaseline />
    <Toolbar style={{ justifyContent: "space-between" }}>
      <Typography variant="h4">
        <div style = {{width: "20%", paddingTop : "5px"}}>
        <Image
            src="/logo.png"
            alt="logo"
            width = {190}
            height = {70}
        />
        </div>
      </Typography>
      <Button style={{
        backgroundColor: "#459b55",
        color: "white"
    }} variant="contained">Sign in</Button>
    </Toolbar>
  </AppBar>
  );
};