import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  Container,
} from "@mui/material";
import Logo from "../images/Logo3.png"
import { Link as RouterLink } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login';

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "#3DED97"}}
    >
      <Container sx={{my:1}}>
      <Toolbar>
        <IconButton size="large" edge="start" aria-label="logo" component={RouterLink} to="/">
          <img src={Logo} alt="logo" style={{width:"40px", height:"auto"}}/>
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "black", fontWeight:"bold" }}
        >
          CODEBOX
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            component={RouterLink} 
            to="/"
            sx={{
              color: "black",
              padding: "6px 16px",
              fontWeight: "bold",
              "&:hover": { bgcolor: "grey" },
            }}
          >
            Home
          </Button>
          <Button
            component={RouterLink} 
            to="/login"
            sx={{
              color: "black",
              fontWeight: "bold",
              "&:hover": { bgcolor: "grey" },
            }}
          >
            Login
            <LoginIcon />
          </Button>
        </Stack>
      </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
