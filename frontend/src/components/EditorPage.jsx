import { Typography} from '@mui/material'
import { makeStyles} from '@mui/styles'
import React from 'react'
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

const EditorPage = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <SideBar />
            <main className={classes.content}>
                <Typography variant='h6'>Hi</Typography>
            </main>
        </div>
  )
}

export default EditorPage