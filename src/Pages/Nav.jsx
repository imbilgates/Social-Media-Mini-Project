import { Link } from 'react-router-dom';
import { useContext } from 'react';
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
            <Link to="/help" className="nav-link">
              <i className='bx bxs-message-dots'></i>
              <span>Help</span>
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