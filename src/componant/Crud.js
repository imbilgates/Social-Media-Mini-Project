import { useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { UserContext } from '../context/UserContext';

function Crud() {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPost, setNewPost] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const usersCollectionRef = collection(db, "users");

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const createUser = async () => {
    setLoading(true);
    try {
      const imgURL = await uploadImage();
      await addDoc(usersCollectionRef, { postTitle: newPostTitle, post: imgURL, userEmail: user?.email, userName: user?.displayName });
      navigate(`/Home`);
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
    <>

      <div className="crud-app">
        {imagePreview && (
          <div className="crud-image-preview">
            <img
              src={imagePreview}
              alt="Preview"
              style={{ height: '150px', width: '150px', marginBottom: '10px' }} />
          </div>
        )}
        <div className="crud-input-container">
          <input
            className="crud-input-field"
            placeholder="Post Title..."
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <div className="crud-file-input-container">
            <input
              type="file"
              onChange={handleFileChange}
              className="crud-file-input"
            />
            <div className="crud-custom-file-input">
              {newPost ? newPost.name : "Choose File"}
            </div>
          </div>
          <button
            className="crud-create-button"
            onClick={createUser}
            disabled={loading}
          >
            {"Upload"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Crud;
