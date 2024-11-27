import { Modal, Box, Typography,TextField } from '@mui/material'
import React from 'react'

const JoinRoomModal = ({open, handleClose}) => {
  return (
    <div>
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
                <Typography id="modal-title" variant="h6" component="h2" sx={{textAlign:"center"}}>
                    Join a New Room ?
                </Typography>
                <TextField name="RoomId" placeholder='Enter RoomId' fullWidth required autoFocus sx={{mb:2}}></TextField>
            </Box>
        </Modal>
    </div>
  )
}

export default JoinRoomModal