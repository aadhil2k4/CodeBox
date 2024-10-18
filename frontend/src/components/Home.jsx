import React from 'react'
import { Box } from '@mui/material'
//import Navbar from "./Navbar.jsx"
//import HeroSection from './HeroSection.jsx'
import Login from './Login.jsx'

const Home = () => {
  return (
    <Box sx={{ width: '100vw', height: '100vh', overflowX: 'hidden' }}>
      {/*<Navbar />
      <HeroSection />*/}
      <Login />
    </Box>
  )
}

export default Home