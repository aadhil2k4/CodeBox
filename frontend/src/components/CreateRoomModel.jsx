import React from 'react'
import { Modal, Box, Typography,TextField, Button } from '@mui/material'

const CreateRoomModel = ({open, handleClose}) => {
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
                    Create a Room ?
                </Typography>
                <TextField name="RoomName" placeholder='Enter Room Name' fullWidth required autoFocus sx={{mb:2}}></TextField>
                <Button>Create Room</Button>
            </Box>
        </Modal>
    </div>
  )
}

export default CreateRoomModel