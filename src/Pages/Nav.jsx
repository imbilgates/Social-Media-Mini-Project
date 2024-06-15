import { Link } from 'react-router-dom';
import Logout from '../auth/Logout';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import 'boxicons/css/boxicons.min.css';

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
            <Link to="/help" className="nav-link">
              <i className='bx bxs-message-dots'></i>
              <span>Help</span>
            </Link>
          </li>
          <li className="nav-item profile">
            <img src={user.photoURL} alt="" style={{height: "40px", width: "40px", borderRadius: "40px"}} />
            <b>{user.email}</b>
            <Logout />
          </li>
        </ul>
      </nav>
    )
  );
};

export default Nav;
