import { Container, Paper, Avatar, Typography, Box, TextField,  Button, Grid2, Link } from '@mui/material'
import React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify'
import LoginImage from "../images/rb_7893.png"
import Navbar from './Navbar'


const Login = () => {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target
        console.log(name, value)
        const copyInfo = {...loginInfo}
        copyInfo[name] = value
        setLoginInfo(copyInfo)
    }

    const handleLogin = async (e) =>{
        e.preventDefault()
        const {email, password} = loginInfo
        if(!email || !password){
            return handleError('All fields are required')
        }
        try{
            const url = 'http://localhost:8080/auth/login'
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const {success, message, error, jwtToken, name} = result;
            if(success){
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/user')
                }, 1000)
            }else if(error){
                const details = error.details[0].message;
                handleError(details);
            }
            else if(!success){
                handleError(message || 'Signup failed')
            }
        }catch(err){
            handleError(err);
        }
    }


  return (
    <>
    <Navbar />
    <Container maxWidth="">
    <Grid2 container spacing={20} alignItems="center" marginTop={4}>
        <Grid2 item xs={12} md={6}>
        <img src={LoginImage} alt="Login" style={{ width: "550px", height: "auto", backgroundColor:"transparent"}}/>
        </Grid2>
        <Grid2 item xs={12} md={6}>
        <Paper elevation={10} maxWidth="xs" sx={{padding:2}}>
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
            <Box component='form' onSubmit={handleLogin} noValidate sx={{mt:1}}>
                <TextField name='email' placeholder='Enter Email Id' fullWidth required autoFocus sx={{mb:2}} onChange={handleChange} value={loginInfo.email}></TextField>
                <TextField name='password' placeholder='Enter Password' fullWidth required sx={{mb:2}} type='password' onChange={handleChange} value={loginInfo.password}></TextField>
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
        </Grid2>
        </Grid2>
        <ToastContainer />
    </Container>
    </>
  )
}

export default Login