import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import useUsers from "../hooks/useUsers"; 
import { Link } from "react-router-dom";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(UserContext);
  const { allUsers, loading, error } = useUsers();

  const filteredUsers = allUsers.filter(u => u.uid !== user.uid && u.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  if(loading) return <div className="Home">Loading...</div>;

  return (
    <div className="allusers-profile">
      <h2>Search Users</h2>
      <input
        type="text"
        className="search-box"
        placeholder="Search @users..."
        value={searchQuery}
        onChange={handleSearch}
      />
      {error && <p>Error: {error.message}</p>}
        <ul className="allusers-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link to={`/chat/userPost/${user.uid}`} style={{textDecoration: "none"}}><li key={user.uid} className="allusers-list-item">
                <img src={user.photoURL} alt="" className={user?.status === "online" ? "online-icon" : "offline-icon"}/>
                <span>{user.displayName}</span>
                {user?.status === "offline" ? <span className="last-seen">Active Log <b>{formatLastLogin(user.lastLogin)}</b></span> :
                <span>{user?.status}</span> }
              </li></Link>
            ))
          ) : (
            <li><b>No users found</b></li>
          )}
        </ul>
    </div>
  );
};

// Function to format last login time into human-readable format
const formatLastLogin = (lastLogin) => {
  if (!lastLogin) return "Never";

  const now = new Date();
  const lastLoginDate = new Date(lastLogin);
  const seconds = Math.floor((now - lastLoginDate) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + " year" + (interval > 1 ? "s" : "") + " ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " month" + (interval > 1 ? "s" : "") + " ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " day" + (interval > 1 ? "s" : "") + " ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minute" + (interval > 1 ? "s" : "") + " ago";
  }
  return "recently";
};

export default Help;
