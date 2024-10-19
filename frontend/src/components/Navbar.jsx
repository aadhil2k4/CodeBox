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
import Logo from "../images/Logo.svg"
import { Link as RouterLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <Container>
    <AppBar
      position="static"
      sx={{ bgcolor: "transparent", boxShadow: "none", paddingY: 2 }}
    >
      <Toolbar>
        <IconButton size="large" edge="start" aria-label="logo" component={RouterLink} to="/">
          <img src={Logo} alt="logo" style={{width:"60px", height:"auto"}}/>
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
              color: "white",
              bgcolor: "black",
              borderRadius: "20px",
              padding: "6px 16px",
              "&:hover": { bgcolor: "grey" },
            }}
          >
            Home
          </Button>
          <Button
            component={RouterLink} 
            to="/login"
            sx={{
              color: "white",
              bgcolor: "black",
              borderRadius: "20px",
              padding: "6px 16px",
              "&:hover": { bgcolor: "grey" },
            }}
          >
            Login
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
    </Container>
  );
};

export default Navbar;
