import React, { useState,useContext,useEffect } from "react";
import { Drawer, Typography, Box, Button } from "@mui/material";
import socket from "../socket"; 
import { makeStyles } from "@mui/styles";
import Members from "./Members";
import { clientContext, filesContext } from "./EditorPage";
import FileTree from './FileTree'

const drawerWidth = 240;

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
    display: "flex",
    flexDirection: "column"
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
    marginBottom:"0px"
  },
  contentContainer: {
    padding: "16px",
    //textAlign: "center",
    color: "white",
    flexGrow: 1
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
  const clients = useContext(clientContext);
  const {selectedFile, setSelectedFile} = useContext(filesContext);

  const [fileTree, setFileTree] = useState({})

  const getFileTree = async() => {
    const response = await fetch('http://localhost:9000/files')
    const result = await response.json();
    setFileTree(result.tree);
  }

  useEffect(()=>{
    getFileTree()
  },[])

  useEffect(()=>{
    socket.on('file:refresh', getFileTree());
    return () => {
      socket.off('file:refresh', getFileTree())
    }
  })

  const [activeLink, setActiveLink] = useState("Members");

  const renderContent = () => {
    switch (activeLink) {
      case "Members":
        return( 
          <Box>
          {clients.map((client)=>(
          <Members key={client.socketId} username={client.username} />
        ))}
        </Box>
        )
      case "Files":
        return(
          <FileTree onSelect={(path)=>setSelectedFile(path)} tree={fileTree}/>
        )
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
