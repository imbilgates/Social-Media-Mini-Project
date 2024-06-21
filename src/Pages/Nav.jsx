import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import 'boxicons/css/boxicons.min.css';
import Account from '../componant/Account';

const Nav = () => {
  const { user } = useContext(UserContext);
  const [scrollingUp, setScrollingUp] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop.current) {
        // Scroll down
        setScrollingUp(false);
      } else {
        // Scroll up
        setScrollingUp(true);
      }
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    user && (
      <nav className={`nav ${scrollingUp ? '' : 'hidden'}`}>
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
              <i className='bx bxs-message-dots'></i>
              <span>Chat</span>
            </Link>
          </li>
          <li className="nav-item profile">
            <Account user={user} />
          </li>
        </ul>
      </nav>
    )
  );
};

export default Nav;
