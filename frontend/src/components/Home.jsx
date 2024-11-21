import React from 'react'
import { Box } from '@mui/material'
import Navbar from "./Navbar.jsx"
import HeroSection from './HeroSection.jsx'

const Home = () => {
  return (
    <Box sx={{ width: '100vw', height: '100vh', overflowX: 'hidden', backgroundColor:"#001122" }}>
      <Navbar />
      <HeroSection />
    </Box>
  )
}

export default Home