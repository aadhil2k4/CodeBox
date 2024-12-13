import React, { useState, useContext, useEffect, useCallback } from "react";
import { Drawer, Typography, Box, Button } from "@mui/material";
import socket from "../socket";
import { makeStyles } from "@mui/styles";
import Members from "./Members";
import { clientContext, filesContext, selectedFileContentContext, codeContext } from "./EditorPage";
import FileTree from "./FileTree";
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

const drawerWidth = 300;

const useStyles = makeStyles({
  drawerWrapper: {
    height: "calc(100vh - 16px)",
    backgroundColor: "black"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor: "black",
    height: "calc(100vh - 16px)"
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#262626 !important",
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
    justifyContent: "space-between",
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
  const { code, setCode } = useContext(codeContext);

  const [fileTree, setFileTree] = useState({});
  const { selectedFileContent, setSelectedFileContent } = useContext(selectedFileContentContext);
  const projectName = localStorage.getItem('currentProjectName') || 'defaultProject';

  const getFileTree = async () => {
    try {
      const response = await fetch(`http://localhost:9000/files?projectName=${projectName}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching file tree: 
          Status: ${response.status} 
          Status Text: ${response.statusText}
          Response: ${errorText}`);
        
        alert(`Failed to load file tree. 
          Status: ${response.status}. 
          Please check server configuration.`);
        return;
      }
      
      const result = await response.json();
      setFileTree(result.tree);
    } catch (error) {
      console.error("Network or parsing error:", error);
      alert("Network error or invalid response from server.");
    }
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    try {
      const response = await fetch(
        `http://localhost:9000/files/content?path=${encodeURIComponent(`${projectName}/${selectedFile}`)}`
      );
      
      const result = await response.json();
      setSelectedFileContent(result.content);
    } catch (error) {
      console.error("Error fetching file contents:", error);
    }
  }, [selectedFile, projectName, setSelectedFileContent]);

  useEffect(() => {
    if (selectedFile && selectedFileContent) {
      setCode(selectedFileContent);
    }
  }, [selectedFile, selectedFileContent, setCode]);

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

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (link === "Files") {
      getFileTree(); // Refresh the file tree when Files section is clicked
    }
  };

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
      <Box className={classes.drawerWrapper}>
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
            <Typography variant="h6">CodeBox</Typography>
          </Box>
          <Box
            sx={{
              borderBottom: "1px solid white",
              margin: "4px 0",
            }}
          ></Box>
          <Box className={classes.linksContainer}>
            {[
              { text: "Members", icon: <PeopleOutlineOutlinedIcon /> },
              { text: "Files", icon: <FolderOutlinedIcon /> },
              { text: "Chat", icon: <ChatBubbleOutlineOutlinedIcon /> },
            ].map(({ text, icon }) => (
              <Button
                key={text}
                onClick={() => handleLinkClick(text)}
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
                {icon}
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
      </Box>
    </div>
  );
};

export default SideBar;
