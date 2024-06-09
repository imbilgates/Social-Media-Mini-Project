import React from 'react'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='Home'>

      <h1>HOME</h1>

      <Outlet />

    </div>
  )
}

export default Home