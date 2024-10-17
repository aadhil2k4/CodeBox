import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

const Navbar = () => {
  return (
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
          sx={{ flexGrow: 1, color: "black" }}
        >
          Collaborative CodeEditor
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
  );
};

export default Navbar;
