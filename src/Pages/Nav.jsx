import { Link } from 'react-router-dom';
import Logout from '../auth/Logout';
import logo from '../assets/img/default-img.jpg';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import React, { useState } from 'react';
import 'boxicons/css/boxicons.min.css';

const Nav = () => {
  const { user } = useContext(UserContext);
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
            <Link to="Home">
             <i class='bx bxs-home-heart'></i>
              <span className="links_name">{isOpen && 'Home'}</span>
            </Link>
            <span className="tooltip">Home</span>
          </li>
          <li>
            <Link to="crud">
              <i class='bx bxs-add-to-queue'></i>
              <span className="links_name">{isOpen && 'Add Post'}</span>
            </Link>
            <span className="tooltip">Add Post</span>
          </li>
          <li>
            <Link to="/crud/postPage">
              <i class='bx bx-list-ul'></i>
              <span className="links_name">{isOpen && 'Post Page'}</span>
            </Link>
            <span className="tooltip">Post Page</span>
          </li>
          <li>
            <Link to="help">
              <i class='bx bxs-message-dots'></i>
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
