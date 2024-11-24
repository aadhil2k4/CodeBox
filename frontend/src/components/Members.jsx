import React from 'react'
import Avatar from "react-avatar"

const Members = ({username}) => {
  return (
    <div style={{display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px"}}>
        <Avatar name={username.toString()} size={50} round="10px" />
        <span>{username.toString()}</span>
    </div>
  )
}

export default Members