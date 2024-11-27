import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import JoinRoomModal from './JoinRoomModal';
import CreateRoomModel from './CreateRoomModel';
//import EditorPage from './EditorPage';

const UserDash = () => {

  const [joinopen, setJoinOpen] = useState(false);
  const [createopen, setCreateOpen] = useState('')
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

  const handlejoinOpen = () => setJoinOpen(true);
  const handlejoinClose = () => setJoinOpen(false);
  const handlecreateOpen = () => setCreateOpen(true);
  const handlecreateClose = () => setCreateOpen(false);

  return (
    /*<EditorPage />*/
    <div style={{textAlign: "center"}}>
      <h1>Hi {loggedInUser} 👋🏻</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2 style={{marginBottom:"10rem"}}>Your Sessions: </h2>
      <button style={{marginRight: "2rem"}} onClick={handlejoinOpen}>Join New Session</button>
      <button onClick={handlecreateOpen}>Create New Session</button>
      <JoinRoomModal open={joinopen} handleClose={handlejoinClose} />
      <CreateRoomModel open={createopen} handleClose={handlecreateClose} />
      <ToastContainer />
      </div>
  )
}

export default UserDash