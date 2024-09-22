import React from 'react'
import TextField from '@mui/material/TextField';
import './Login.css'

const Login = () => {
  return (
    <div className='loginClass'>
        <h3>Room Id</h3>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <h3>Name</h3>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </div>
  )
}

export default Login