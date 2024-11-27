import { makeStyles} from '@mui/styles'
import React, { useState,createContext, useContext } from 'react'
import SideBar from './SideBar'
import Editor from './Editor'
import Terminal from './terminal'

const useStyles = makeStyles({
    root:{
        display: 'flex',
        height: '100vh'
    },
    content:{
        flexGrow: 1,
        padding: "16px",
        minHeight: "100vh",
        backgroundColor: "#001122",
        color: 'white'
    }
})

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

    const [files, setFiles] = useState([
        {name: "main.js", type: "javascript", "content": ""}
    ])
    const [selectedFile,setSelectedFile] = useState("");
    const [selectedFileContent, setSelectedFileContent] = useState("");
    const [code, setCode] = useState('')



    return (
        <div className={classes.root}>
            <codeContext.Provider value={{code,setCode}}>
            <selectedFileContentContext.Provider value={{selectedFileContent,setSelectedFileContent}}>
            <clientContext.Provider value={clients}>
                <filesContext.Provider value={{files, setFiles, selectedFile, setSelectedFile}}>
            <SideBar />
            <main className={classes.content}>
                {selectedFile && <p>{selectedFile.replaceAll("/"," > ")}</p>}
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