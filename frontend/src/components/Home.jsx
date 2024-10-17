import React from 'react'
import { Container } from '@mui/material'
import Navbar from "./Navbar.jsx"
import HeroSection from './HeroSection.jsx'

const Home = () => {
  return (
    <Container sx={{ width: '100vw', height: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <HeroSection />
    </Container>
  )
}

export default Home