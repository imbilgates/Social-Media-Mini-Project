import { doc, updateDoc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const Update = () => {
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPost, setEditedPost] = useState("");
  const [editedPostURL, setEditedPostURL] = useState(""); // Store the URL of the image in storage
  const [newPostFile, setNewPostFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const userDoc = doc(db, "users", id);
      const userData = await getDoc(userDoc);
      if (userData.exists()) {
        setEditedTitle(userData.data().postTitle);
        setEditedPost(userData.data().post);
        setEditedPostURL(userData.data().post); // Set the storage URL
      }
    };
    getUser();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostFile(file);
      const previewURL = URL.createObjectURL(file);
      setEditedPost(previewURL);
    }
  };

  const deleteImage = async (url) => {
    const imgRef = ref(storage, url);
    try {
      await deleteObject(imgRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };

  const updateUser = async () => {
    setLoading(true);
    try {
      let imgURL = editedPostURL;
      if (newPostFile) {
        // Delete the old image if a new one is selected
        if (imgURL) {
          await deleteImage(imgURL);
        }
        imgURL = await uploadImage(newPostFile);
      }
      const userDoc = doc(db, "users", id);
      const updatedPost = { postTitle: editedTitle, post: imgURL };
      await updateDoc(userDoc, updatedPost);
      navigate(`/Profile`);
    } catch (error) {
      console.error("Error updating user or uploading image: ", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const imgRef = ref(storage, `images/${file.name + uuidv4()}`);
    await uploadBytes(imgRef, file);
    const imgURL = await getDownloadURL(imgRef);
    return imgURL;
  };

  return (
    <div className='App'>
      <div className="input-container">
        {editedPost && <img src={editedPost} alt="Post" style={{ height: '150px', width: '150px', marginBottom: '10px' }} />}
        <input
          className="input-field"
          placeholder="Edit Title..."
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <input
          type="file"
          className="input-field"
          onChange={handleImageChange}
        />
        <button className="create-button" onClick={updateUser} disabled={loading}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Update;
