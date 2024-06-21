import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import useUsers from "../hooks/useUsers"; // Adjust this import according to your project structure

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(UserContext);
  const { allUsers, loading, error } = useUsers();

  const filteredUsers = allUsers.filter(u => u.uid !== user.uid && u.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

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
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {searchQuery && (
        <ul className="allusers-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li key={user.uid} className="allusers-list-item">
                <img src={user.photoURL} alt="" />
                <span>{user.displayName}</span>
                <span className="last-seen">Active Log <b>{formatLastLogin(user.lastLogin)}</b></span>
              </li>
            ))
          ) : (
            <li><b>No users found</b></li>
          )}
        </ul>
      )}
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
