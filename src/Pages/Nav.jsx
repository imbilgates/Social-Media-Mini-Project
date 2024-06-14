import { Link } from 'react-router-dom';
import Logout from '../auth/Logout';
// import logo from '../assets/img/default-img.jpg';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import 'boxicons/css/boxicons.min.css';

const Nav = () => {
  const { user } = useContext(UserContext);


  return (
    user && (
      <nav className="top-nav">
        <ul className="nav-list">
          <li>
            <Link to="/Home" className="nav-link">
              <i className='bx bxs-home-heart'></i>
              <span className="links_name">Home</span>
            </Link>

            <Link to="/Profile" className="nav-link">
              <i className='bx bxs-user'></i>
              <span className="links_name">My Profile</span>
            </Link>

            <Link to="/crud" className="nav-link">
              <i className='bx bxs-add-to-queue'></i>
              <span className="links_name">Add Post</span>
            </Link>

            <Link to="/help" className="nav-link">
              <i className='bx bxs-message-dots'></i>
              <span className="links_name">Help</span>
            </Link>
          </li>
          <li className="profile">
            <div className="profile-details">
              {/* <img
                alt="profileImg"
                src={user?.photoURL || logo}
                className="profile-image"
              /> */}
              {/* <div className="name_job">
                <div className="job">{user?.email}</div>
                <div className="name">{user?.displayName}</div>
              </div> */}
              <Logout />
            </div>
          </li>
        </ul>
      </nav>
    )
  );
};

export default Nav;
