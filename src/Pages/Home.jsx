import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='Home'>

      <nav>
        <Link to={"search"}>Search Post</Link>
        <Link to={"addPost"}>addPost</Link>
        <Link to={"PostPage"}>PostPage</Link>
      </nav>

      <Outlet />

    </div>
  )
}

export default Home