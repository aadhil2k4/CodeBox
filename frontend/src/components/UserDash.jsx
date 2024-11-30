import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Box, Typography, Button, Modal, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const UserDash = () => {
  const [open, setOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    toast.success('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const generateRoomId = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Room Id Generated');
  };

  const handleCreateRoom = () => {
    if (!roomId || !roomName) {
      toast.error('Please enter a room name and generate a room ID');
      return;
    }
    navigate(`/editor/${roomId}`, { state: { roomName, roomId } });
    toast.success("Room is created")
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Toaster position="top-center" />
      <h1>Hi {loggedInUser} 👋🏻</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2 style={{ marginBottom: '10rem' }}>Your Sessions: </h2>
      <button onClick={handleOpen}>Join Room</button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-title"
            variant="h5"
            component="h2"
            sx={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            CodeBox
          </Typography>
          <Typography id="modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            Create a Room
          </Typography>
          <TextField
            name="RoomName"
            placeholder="Enter Room Name"
            fullWidth
            autoFocus
            sx={{ mb: 2 }}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <TextField
            name="RoomId"
            placeholder="Enter Room Id"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleCreateRoom}>
            Create Room
          </Button>
          <Link onClick={generateRoomId} style={{ cursor: 'pointer', display: 'block', marginTop: '10px', textAlign: 'center' }}>
            Generate New Room ID
          </Link>
        </Box>
      </Modal>
    </div>
  );
};

export default UserDash;
