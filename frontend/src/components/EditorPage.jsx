import { Typography} from '@mui/material'
import { makeStyles} from '@mui/styles'
import React, { useState,createContext } from 'react'
import SideBar from './SideBar'

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

const EditorPage = () => {
    const classes = useStyles();

    const [clients, setClients] = useState([
        {socketId: 1, username: "Aadhil"},
        {socketId: 2, username: "Max"},
        {socketId: 3, username: "King"}
    ])

    return (
        <div className={classes.root}>
            <clientContext.Provider value={clients}>
            <SideBar />
            </clientContext.Provider>
            <main className={classes.content}>
                <Typography variant='h6'>Editor</Typography>
            </main>
        </div>
    )
}

export default EditorPage