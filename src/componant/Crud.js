import { useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { UserContext } from '../context/UserContext'

function Crud() {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPost, setNewPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const usersCollectionRef = collection(db, "users");

  const navigate = useNavigate();
  const  { user } = useContext(UserContext)


  const createUser = async () => {
    setLoading(true);
    try {
      const imgURL = await uploadImage();
      await addDoc(usersCollectionRef, { postTitle: newPostTitle, post: imgURL, userEmail: user?.email, userName: user?.displayName});
      navigate(`/crud/postPage`);
    } catch (error) {
      console.error("Error creating user or uploading image: ", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (newPost == null) return null;
    const imgRef = ref(storage, `images/${newPost.name + v4()}`);
    await uploadBytes(imgRef, newPost);
    const imgURL = await getDownloadURL(imgRef);
    return imgURL;
  };

  return (
    <div className="app">
      <div className="input-container">
        <input
          className="input-field"
          placeholder="PostTitle..."
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <input
          type='file'
          className="input-field"
          placeholder="Post..."
          onChange={(e) => setNewPost(e.target.files[0])}
        />
        <button className="create-button" onClick={createUser} disabled={loading}>
          {"Upload"}
        </button>
      </div>
    </div>
  );
}

export default Crud;
