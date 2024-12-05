import { makeStyles} from '@mui/styles'
import React, { useState,createContext } from 'react'
import SideBar from './SideBar'
import Editor from './Editor'
import Terminal from './terminal'

const useStyles = makeStyles({
    root: {
      display: 'flex',
      height: '100vh',
    },
    content: {
      flexGrow: 1,
      paddingRight: '16px',
      paddingLeft: '16px',
      minHeight: '100vh',
      backgroundColor: '#001122',
      color: 'white',
    },
    filePath: {
      textDecoration: 'underline',
      marginBottom: '10px',
    },
    noFileSelected: {
      color: '#ccc',
      fontStyle: 'italic',
      marginBottom: '10px',
    },
  });

export const clientContext = createContext();
export const filesContext = createContext();
export const selectedFileContentContext = createContext();
export const codeContext = createContext();

const EditorPage = () => {
    const classes = useStyles();

    const [clients, setClients] = useState([
        {socketId: 1, username: "Aadhil"},
        {socketId: 2, username: "Max"},
        {socketId: 3, username: "King"}
    ])

    const [selectedFile,setSelectedFile] = useState("");
    const [selectedFileContent, setSelectedFileContent] = useState("");
    const [code, setCode] = useState('')



    return (
        <div className={classes.root}>
            <codeContext.Provider value={{code,setCode}}>
            <selectedFileContentContext.Provider value={{selectedFileContent,setSelectedFileContent}}>
            <clientContext.Provider value={clients}>
                <filesContext.Provider value={{selectedFile, setSelectedFile}}>
            <SideBar />
            <main className={classes.content}>
            {selectedFile ? (
                  <p className={classes.filePath}>{selectedFile.replaceAll('/', ' > ')}</p>
                ) : (
                  <p className={classes.noFileSelected}>Select a file</p>
                )}
                <Editor />
                <Terminal />
            </main>
            </filesContext.Provider>
            </clientContext.Provider>
            </selectedFileContentContext.Provider>
            </codeContext.Provider>
        </div>
    )
}

export default EditorPage