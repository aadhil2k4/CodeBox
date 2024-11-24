import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Stack,
  Button,
  Container,
} from "@mui/material";
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
        <Box sx={{display:"inline-flex", border:"3px solid black", padding:"2px 4px" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, color: "black", fontWeight:"bold"}}
        >
        CodeBox
        </Typography>
        </Box>
        <Box sx={{flexGrow: 1}}></Box>
        <Stack direction="row" spacing={2}>
          <Button
            component={RouterLink} 
            to="/"
            sx={{
              color: "black",
              padding: "6px 16px",
              fontWeight: "bold",
              "&:hover": { bgcolor: "grey" },
              textTransform:"none",
              fontSize:"20px",
              border:"1px solid green"
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
