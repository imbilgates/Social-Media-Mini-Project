import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { UserContext } from '../context/UserContext';
import Heart from "react-animated-heart";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredUserId, setHoveredUserId] = useState(null);
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

  const toggleLike = async (postId) => {
    try {
      const postDocRef = doc(db, 'users', postId);
      const postDoc = await getDoc(postDocRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();
        const likedBy = postData.likedBy || [];
        const isLiked = likedBy.includes(user.uid);

        const updatedLikedBy = isLiked
          ? likedBy.filter(id => id !== user.uid)
          : [...likedBy, user.uid];

        const updatedLikes = updatedLikedBy.length;

        await updateDoc(postDocRef, { likedBy: updatedLikedBy, likes: updatedLikes });

        setUsers(users.map(post =>
          post.id === postId ? { ...post, likedBy: updatedLikedBy, likes: updatedLikes } : post
        ));
      }
    } catch (err) {
      console.error('Error updating like status:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <div className="user-list">
        {users.map((post) => {
          const isLiked = post.likedBy && post.likedBy.includes(user.uid);
          return (
            <div
              onDoubleClick={() => toggleLike(post.id)}
              className={`user-card ${hoveredUserId && hoveredUserId !== post.id ? 'blurred' : ''}`}
              key={post.id}
              onMouseEnter={() => setHoveredUserId(post.id)}
              onMouseLeave={() => setHoveredUserId(null)}
            >
              <p>@{post.userName}</p>
              <img src={post.post} alt="" style={{ height: '150px', width: '150px' }} /> 
              <p><b>Title: {post.postTitle}</b></p>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <Heart
                  id={post.postId}
                  isClick={isLiked}
                  onClick={() => toggleLike(post.id)}
                  style={{ marginRight: '8px', cursor: 'pointer' }}
                />
                <span>{post.likes} Likes</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
};

export default Home;
