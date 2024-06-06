import React from 'react'
import { Outlet } from 'react-router-dom'
import Register from '../componant/Register'

const ProtectRoute = ({user}) => {
  return (
    <>
    {user ? <Outlet /> : <Register />}    
    </>
  )
}

export default ProtectRoute