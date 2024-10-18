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
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

const Navbar = () => {
  return (
    <Container>
    <AppBar
      position="static"
      sx={{ bgcolor: "transparent", boxShadow: "none", paddingY: 2 }}
    >
      <Toolbar>
        <IconButton size="large" edge="start" aria-label="logo">
          <LaptopMacIcon sx={{fontSize: 40}}/>
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
            sx={{
              color: "white",
              bgcolor: "black",
              borderRadius: "20px",
              padding: "6px 16px",
              "&:hover": { bgcolor: "grey" },
            }}
          >
            Compiler
          </Button>
          <Button
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
