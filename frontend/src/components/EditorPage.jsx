import { makeStyles} from '@mui/styles'
import React, { useState,createContext } from 'react'
import SideBar from './SideBar'
import Editor from './Editor'

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

    return (
        <div className={classes.root}>
            <clientContext.Provider value={clients}>
                <filesContext.Provider value={{files, setFiles}}>
            <SideBar />
            <main className={classes.content}>
                <Editor />
            </main>
            </filesContext.Provider>
            </clientContext.Provider>
        </div>
    )
}

export default EditorPage