import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import {Box, Typography, Button, Modal, TextField} from '@mui/material'
//import EditorPage from './EditorPage';
import { v4 as uuidv4 } from "uuid";

const UserDash = () => {

  const [open, setOpen] = useState('')
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate()

  const [roomId, setRoomId] = useState("");

  const generateRoomId = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
  }


  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  }, []);

  const handleLogout = (e) =>{
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    toast.success('User Logged out')
    setTimeout(()=>{
      navigate('/login');
    },1000)
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    /*<EditorPage />*/
    <div style={{textAlign: "center"}}>
      <Toaster position='top-center'></Toaster>
      <h1>Hi {loggedInUser} 👋🏻</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2 style={{marginBottom:"10rem"}}>Your Sessions: </h2>
      <button onClick={handleOpen}>Join Room</button>
      <Modal open={open} onClose={handleClose}>
            <Box sx={{  position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,}}>
                <Typography id="modal-title" variant="h5" component="h2" sx={{textAlign:"center", textDecoration:"bold"}}>CodeBox</Typography>
                <Typography id="modal-title" variant="h6" component="h2" sx={{textAlign:"center"}}>
                    Create a Room ?
                </Typography>
                <TextField name="RoomName" placeholder='Enter Room Name' fullWidth /*required*/ autoFocus sx={{mb:2}}></TextField>
                <TextField name="RoomId" placeholder='Enter Room Id' fullWidth required autoFocus sx={{mb:2}} value={roomId} 
                  onChange={(e)=>setRoomId(e.target.value)}></TextField>
                <Button>Create Room</Button>
                <Link onClick={generateRoomId}>Create New Room</Link>
            </Box>
        </Modal>
      </div>
  )
}

export default UserDash