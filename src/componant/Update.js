import { doc, updateDoc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';

const Update = () => {
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPost, setEditedPost] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const userDoc = doc(db, "users", id);
      const userData = await getDoc(userDoc);
      if (userData.exists()) {
        setEditedTitle(userData.data().postTitle);
        setEditedPost(userData.data().post);
      }
    };
    getUser();
  }, [id]);

  const updateUser = async () => {
    const userDoc = doc(db, "users", id);
    const editedPosts = { postTitle: editedTitle, post: editedPost };
    await updateDoc(userDoc, editedPosts);
    navigate(`/crud/postPage`)
  };

  return (
    <div className='App'>
        <div className="input-container">
        <input
            className="input-field"
            placeholder="Edit Title..."
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
        />
        <input
            className="input-field"
            placeholder="Edit Post..."
            value={editedPost}
            onChange={(e) => setEditedPost(e.target.value)}
        />
        <button className="create-button" onClick={updateUser}>Save Changes</button>
        </div>
    </div>
  );
};

export default Update;
