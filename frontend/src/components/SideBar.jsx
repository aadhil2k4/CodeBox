import React, { useState } from "react";
import { Drawer, Typography, Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

const drawerWidth = 300;

const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "black !important",
    color: "white",
    borderRight: "4px solid white",
  },
  root: {
    display: "flex",
    height: "100vh",
  },
  linksContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    margin: "4px 0",
  },
  contentContainer: {
    padding: "16px",
    textAlign: "center",
    color: "white",
  },
  footer:{
    display: "flex",
    justifyContent: "space-around",
    marginTop:"auto",
    marginBottom: "15px",
    padding: "0 8px"
  }
});

const SideBar = () => {
  const classes = useStyles();

  const [activeLink, setActiveLink] = useState("Members");

  const renderContent = () => {
    switch (activeLink) {
      case "Members":
        return <Typography>Members Section Content</Typography>;
      case "Files":
        return <Typography>Files Section Content</Typography>;
      case "Chat":
        return <Typography>Chat Section Content</Typography>;
      default:
        return <Typography>Welcome!</Typography>;
    }
  };

  return (
    <div className={classes.root}>
      {/* Sidebar */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
      >
        <Box
          sx={{
            margin: "16px auto",
            textAlign: "center",
            border: "2px solid",
            display: "inline-block",
            padding: "4px 8px",
            color: "white",
            marginBottom:"1px solid white"
          }}
        >
          <Typography variant="h5">CodeBox</Typography>
        </Box>
        <Box
          sx={{
            borderBottom: "1px solid white",
            margin: "4px 0",
          }}
        ></Box>
        <Box className={classes.linksContainer}>
          {["Members", "Files", "Chat"].map((text) => (
            <Button
              key={text}
              onClick={() => setActiveLink(text)}
              sx={{
                color: activeLink === text ? "#3DED97" : "white",
                fontWeight: activeLink === text ? "bold" : "normal",
                textDecoration: activeLink === text ? "bold" : "none",
                "&:hover": {
                  color: "#3DED97",
                },
              }}
            >
              {text}
            </Button>
          ))}
        </Box>
        <Box className={classes.contentContainer}>{renderContent()}</Box>
        <Box className={classes.footer}>
            <Button variant="outline" sx={{color:"white", backgroundColor:"green"}}>Copy Id</Button>
            <Button variant="outline" sx={{color:"white", backgroundColor:"red"}}>Leave Room</Button>
        </Box>
      </Drawer>
    </div>
  );
};

export default SideBar;
