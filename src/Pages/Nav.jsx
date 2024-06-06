import { Link } from 'react-router-dom';
import Logout from '../auth/Logout';
import logo from '../assets/img/default-img.jpg';
import { useContext } from 'react';
import { navContext } from '../context/NavContexts';
import React, { useState } from 'react';
import 'boxicons/css/boxicons.min.css';

const Nav = () => {
  const { user } = useContext(navContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuBtnChange = () => {
    return isOpen ? 'bx bx-menu-alt-right' : 'bx bx-menu';
  };

  return (
    user && (
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-details">
          <i class='bx bxl-instagram icon' ></i>
          <div className="logo_name">SnapGram</div>
          <i className={menuBtnChange()} id="btn" onClick={toggleSidebar}></i>
        </div>
        <ul className="nav-list">
          <li>
            <i className='bx bx-search' onClick={toggleSidebar}></i>
            <input type="text" placeholder="Search..." />
            <span className="tooltip">Search</span>
          </li>
          <li>
            <Link to="empty">
              <i className='bx bx-grid-alt'></i>
              <span className="links_name">{isOpen && 'Home'}</span>
            </Link>
            <span className="tooltip">Home</span>
          </li>
          <li>
            <Link to="Home">
              <i className='bx bx-user'></i>
              <span className="links_name">{isOpen && 'Users'}</span>
            </Link>
            <span className="tooltip">Users</span>
          </li>
          <li>
            <Link to="about">
              <i className='bx bx-chat'></i>
              <span className="links_name">{isOpen && 'About'}</span>
            </Link>
            <span className="tooltip">About</span>
          </li>
          <li>
            <Link to="help">
              <i className='bx bx-chat'></i>
              <span className="links_name">{isOpen && 'Help'}</span>
            </Link>
            <span className="tooltip">Help</span>
          </li>
          <li className="profile">
            <div className="profile-details">
              <img
                alt="profileImg"
                src={user?.photoURL || logo}
                className="profile-image"
              />
              <div className="name_job">
                <div className="job">{user?.email}</div>
                <div className="name">{user?.displayName}</div>
              </div>
                <Logout />
            </div>
          </li>
        </ul>
      </div>
    )
  );
};

export default Nav;
