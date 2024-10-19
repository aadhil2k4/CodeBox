import { Container, Paper, Avatar, Typography, Box, TextField, Button, Grid2, Link } from '@mui/material'
import Navbar from './Navbar'
import React from 'react'
import UploadIcon from '@mui/icons-material/Upload';
import { Link as RouterLink } from "react-router-dom"

const Login = () => {

    const handleSubmit = () =>{
        console.log('Login')
    }

  return (
    <>
    <Navbar />
    <Container maxWidth="xs">
        <Paper elevation={10} sx={{marginTop:8, padding:2}}>
            <Avatar sx={{
                mx:'auto',
                bgcolor:'secondary.main',
                textAlign:'center',
                mb:1
            }}>
                <UploadIcon />
            </Avatar>
            <Typography component='h1' variant='h5' sx={{textAlign:'center'}}>
                Sign Up
            </Typography>
            <Box component='form' onSubmit={handleSubmit} noValidate sx={{mt:1}}>
                <TextField placeholder='Enter Username' fullWidth required autoFocus sx={{mb:2}}></TextField>
                <TextField placeholder='Enter Email Id' fullWidth required autoFocus sx={{mb:2}}></TextField>
                <TextField placeholder='Enter Password' fullWidth required sx={{mb:2}} type='password'></TextField>
                <Button type='submit' variant='contained' fullWidth sx={{mt:1}}>
                    Sign Up
                </Button>
            </Box>
            <Grid2 container justifyContent={'space-between'} sx={{mt:1}}>
                <Grid2 item>
                    <Link component={RouterLink} to='/Login'>
                        Login
                    </Link>

                </Grid2>
            </Grid2>
        </Paper>
    </Container>
    </>
  )
}

export default Login