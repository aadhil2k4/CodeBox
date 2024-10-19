import React from 'react'
import HeroImage from '../images/HeroImage.svg'
import Wave from '../images/Wave.svg'
import { Box, Grid2, Typography, Button, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const HeroSection = () => {
  return (
    <Box sx={{flexGrow:1, padding:4, background: `url(${Wave})`, backgroundSize: 'cover', backgroundPosition:'center'
    ,width:'100vw', height:'auto', zIndex:1}}>
      <Container sx={{my:2}}>
        <Grid2 container spacing={8} alignItems="center">
            <Grid2 item xs={12} md={6}>
                <Grid2 item xs={12} md={6}>
                    <Typography variant='h4' component='h4' gutterBottom sx={{fontWeight: 'bold', fontSize:'35px', py:2}}>
                    Collaboration Made Simple<br/> for Your Projects
                    </Typography>
                    <Typography variant='h5' gutterBottom sx={{py:2}}>
                    Collaborate with friends in real-time to write,<br/>compile, and run code together effortlessly.
                    </Typography>
                    <Button
            component={RouterLink}
            to="/signup"
            sx={{
              color: "white",
              bgcolor: "black",
              borderRadius: "20px",
              padding: "6px 16px",
              "&:hover": { bgcolor: "grey" },
            }}
          >SignUp</Button>
                </Grid2>
            </Grid2>
            <Grid2 item xs={12} md={6}>
            <img src={HeroImage} alt="Hero" style={{ width: "550px", height: "auto", backgroundColor:"transparent" }} />
            </Grid2>
        </Grid2>
        </Container>
    </Box>
  )
}

export default HeroSection