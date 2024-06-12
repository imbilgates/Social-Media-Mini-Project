import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const PostPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchUsers = async () => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [users]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <div className="user-list">
        {users.map((post) => (
          <div className="user-card" key={post.id}>
            <p>@{post.userName}</p>
            <h1 className="user-name">caption: {post.postTitle}</h1>
            <img src={post.post} alt="" style={{ height: '150px', width: '150px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
