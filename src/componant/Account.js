import React, { useContext } from 'react';
import Logout from '../auth/Logout';
import useUsers from '../hooks/useUsers';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Account = () => {
    const { setIsModalOpen } = useContext(UserContext);
    const { allUsers } = useUsers();
    const user = allUsers.find(user => user.email === auth.currentUser.email);

    return (
        <div className="account-container">
            <div className="user-info">
                <Link to={"Profile"} onClick={() => setIsModalOpen(true)}>
                    <img
                        src={user?.photoURL}
                        alt=''
                        className="user-photo"
                    />
                </Link>
                <span>@{user?.displayName}</span>
                <Logout />
            </div>
        </div>
    );
}

export default Account;
