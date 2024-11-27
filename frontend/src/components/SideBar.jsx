import React, { useState, useContext, useEffect, useCallback } from "react";
import { Drawer, Typography, Box, Button } from "@mui/material";
import socket from "../socket";
import { makeStyles } from "@mui/styles";
import Members from "./Members";
import { clientContext, filesContext, selectedFileContentContext, codeContext} from "./EditorPage";
import FileTree from "./FileTree";

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
    display: "flex",
    flexDirection: "column",
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
    marginBottom: "0px",
  },
  contentContainer: {
    padding: "16px",
    color: "white",
    flexGrow: 1,
    overflow: "auto"
  },
  footer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "auto",
    marginBottom: "15px",
    padding: "10px 8px",
    borderTop: "1px solid white"
  },
});

const SideBar = () => {
  const classes = useStyles();
  const clients = useContext(clientContext);
  const { selectedFile, setSelectedFile } = useContext(filesContext);
  const {code, setCode} = useContext(codeContext);

  const [fileTree, setFileTree] = useState({});
  const {selectedFileContent, setSelectedFileContent} = useContext(selectedFileContentContext);

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    try {
      const response = await fetch(
        `http://localhost:9000/files/content?path=${selectedFile}`
      );
      const result = await response.json();
      setSelectedFileContent(result.content);
    } catch (error) {
      console.error("Error fetching file contents:", error);
    }
  }, [selectedFile, setSelectedFileContent]);
  

  useEffect(()=>{
    if(selectedFile && selectedFileContent){
      setCode(selectedFileContent);
    }
  },[selectedFile, selectedFileContent, setCode])

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  useEffect(() => {
    const refreshHandler = getFileTree;
    socket.on("file:refresh", refreshHandler);
    return () => {
      socket.off("file:refresh", refreshHandler);
    };
  }, [getFileTree]);

  const [activeLink, setActiveLink] = useState("Members");

  const renderContent = () => {
    switch (activeLink) {
      case "Members":
        return (
          <Box>
            {clients.map((client) => (
              <Members key={client.socketId} username={client.username} />
            ))}
          </Box>
        );
      case "Files":
        return <FileTree onSelect={(path) => setSelectedFile(path)} tree={fileTree} />;
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
          <Button variant="outline" sx={{ color: "white", backgroundColor: "green" }}>
            Copy Id
          </Button>
          <Button variant="outline" sx={{ color: "white", backgroundColor: "red" }}>
            Leave Room
          </Button>
        </Box>
      </Drawer>
    </div>
  );
};

export default SideBar;
