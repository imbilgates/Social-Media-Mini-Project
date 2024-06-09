import { useState } from 'react';
import { addDoc, collection} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Crud() {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPost, setNewPost] = useState("");
  const usersCollectionRef = collection(db, "users");
  const navigate = useNavigate();

  const createUser = async () => {
    await addDoc(usersCollectionRef, { postTitle: newPostTitle, post: newPost });
    navigate(`/crud/postPage`)
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
          className="input-field"
          placeholder="Post..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button className="create-button" onClick={createUser}>Upload</button>
      </div>
    </div>
  );
}

export default Crud;
