import { useContext, useEffect, useState } from "react";
import { getAllUsers } from "../firebase";
import { UserContext } from "../context/UserContext";

const Help = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const users = await getAllUsers();
      const filteredUsers = users.filter(u => u.uid !== user.uid);
      setAllUsers(filteredUsers);
    };

    fetchAllUsers();
  }, [user]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = allUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
