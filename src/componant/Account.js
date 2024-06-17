import React from 'react';
import Logout from '../auth/Logout';

const Account = ({ user }) => {
    return (
        <div className="account-container">
            <div className="user-info">
                <img
                    src={user?.photoURL}
                    alt=''
                    className="user-photo"
                />
                <span>@{user?.displayName}</span>
                <Logout />
            </div>
        </div>
    );
}

export default Account;
