import React, { useState } from 'react';
import Logout from '../auth/Logout';

const Account = ({ user }) => {
    const [isShowing, setIsShowing] = useState(false);

    return (
        <div className="user-info">
            <img 
                onClick={() => setIsShowing(!isShowing)} 
                className="user-img" 
                src={user.photoURL} 
                alt="" 
                style={{ height: "40px", width: "40px", borderRadius: "40px" }} 
            />
            <div className={`dropdown ${isShowing ? 'show' : ''}`}>
                <b className="username">{user.displayName}</b>
                <Logout />
            </div>
        </div>
    );
}

export default Account;
