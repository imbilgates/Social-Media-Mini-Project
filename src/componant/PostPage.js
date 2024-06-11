import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { ref, deleteObject } from 'firebase/storage';
import { UserContext } from '../context/UserContext';

const PostPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

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

  const deleteUser = async (id, postUrl) => {
    try {
      // Delete the image from Firebase Storage
      const imageRef = ref(storage, postUrl);
      await deleteObject(imageRef);

      // Delete the Firestore document
      const userDoc = doc(db, 'users', id);
      await deleteDoc(userDoc);

      // Refetch users
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
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
            <br />
            {post.userEmail === user.email && (
              <>
                <button
                  className="update-button"
                  onClick={() => navigate(`/crud/update/${post.id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteUser(post.id, post.post)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
