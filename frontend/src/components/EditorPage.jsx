import { Drawer, Typography, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'

const drawerWidth = 240;
const useStyles = makeStyles({
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor:"#001122 !important",
        color: "white",
        borderRight: "4px solid green"
    },
    root: {
        display: 'flex',
        height: "100vh"
    }
})

const EditorPage = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {/* SIDEBAR */}
            <Drawer
                className={classes.drawer}
                variant='permanent'
                anchor="left"
                classes={{paper: classes.drawerPaper}}
            >
                <Box sx={{margin: "16px auto", textAlign:"center", border: "2px solid", display:"inline-block",
                        padding:"8px, 16px"}}>
                    <Typography variant="h5">
                        CodeBox
                    </Typography>
                </Box>
            </Drawer>
        </div>
  )
}

export default EditorPage