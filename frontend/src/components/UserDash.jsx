import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const UserDash = () => {

  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  }, []);

  const handleLogout = (e) =>{
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out')
    setTimeout(()=>{
      navigate('/login');
    },1000)
  }

  return (
    <div style={{textAlign: "center"}}>
      <h1>Hi {loggedInUser} 👋🏻</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2 style={{marginBottom:"10rem"}}>Your Sessions: </h2>
      <button style={{marginRight: "2rem"}}>Join New Session</button>
      <button>Create New Session</button>
      <ToastContainer />
      </div>
  )
}

export default UserDash