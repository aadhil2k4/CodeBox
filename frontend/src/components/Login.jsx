import { Container, Paper, Avatar, Typography, Box, TextField, FormControlLabel, Button, Grid2, Link } from '@mui/material'
import Navbar from './Navbar'
import React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
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
                <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5' sx={{textAlign:'center'}}>
                Sign In
            </Typography>
            <Box component='form' onSubmit={handleSubmit} noValidate sx={{mt:1}}>
                <TextField placeholder='Enter Email Id' fullWidth required autoFocus sx={{mb:2}}></TextField>
                <TextField placeholder='Enter Password' fullWidth required sx={{mb:2}} type='password'></TextField>
                <FormControlLabel control={<input type='checkbox' />} label='Remember Me'></FormControlLabel>
                <Button type='submit' variant='contained' fullWidth sx={{mt:1}}>
                    Sign In
                </Button>
            </Box>
            <Grid2 container justifyContent={'space-between'} sx={{mt:1}}>
                <Grid2 item>
                    <Link component={RouterLink} to='/forgot'>
                        Forgot Password?
                    </Link>

                </Grid2>
                <Grid2 item>
                    <Link component={RouterLink} to='/signup'>
                        SignUp
                    </Link>

                </Grid2>
            </Grid2>
        </Paper>
    </Container>
    </>
  )
}

export default Login