import React from 'react'
import { Container } from '@mui/material'
import Navbar from "./Navbar.jsx"
import HeroSection from './HeroSection.jsx'

const Home = () => {
  return (
   <Container sx={{ height: "100vh"}}>
      <Navbar />
      <HeroSection />
    </Container>
  )
}

export default Home