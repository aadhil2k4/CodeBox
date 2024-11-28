import React from 'react'
import Home from './components/Home'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import UserDash from './components/UserDash'
import EditorPage from './components/EditorPage'

const App = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user" element={<UserDash />} />
          <Route path='/editor/:roomId' element={<EditorPage />} />
        </Routes>
    </div>
  )
}

export default App
