import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { ref, deleteObject } from 'firebase/storage';

const PostPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteUser = async (id, postUrl) => {
    // Delete the image from Firebase Storage
    const imageRef = ref(storage, postUrl);
    await deleteObject(imageRef).catch((error) => {
      console.error("Error deleting image: ", error);
    });

    // Delete the Firestore document
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc).catch((error) => {
      console.error("Error deleting document: ", error);
    });

    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='App'>
      <div className="user-list">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <h1 className="user-name">caption: {user.postTitle}</h1>
            <img src={user.post} alt="" style={{ height: "150px", width: "150px" }} /> <br />
            <button className="update-button" onClick={() => navigate(`/crud/update/${user.id}`)}>Edit</button>
            <button className="delete-button" onClick={() => deleteUser(user.id, user.post)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostPage;
