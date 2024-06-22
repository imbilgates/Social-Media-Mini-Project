import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import 'boxicons/css/boxicons.min.css';
import Account from '../componant/Account';

const Nav = () => {
  const { user } = useContext(UserContext);

  return (
    user && (
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/Home" className="nav-link">
              <i className='bx bxs-home-heart'></i>
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/Profile" className="nav-link">
              <i className='bx bxs-user'></i>
              <span>My Profile</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/crud" className="nav-link">
              <i className='bx bxs-add-to-queue'></i>
              <span>Add Post</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/chat" className="nav-link">
              <i className='bx bxs-search'></i>
              <span>Users</span>
            </Link>
          </li>
          <li className="nav-item profile">
            <Account />
          </li>
        </ul>
      </nav>
    )
  );
};

export default Nav;
