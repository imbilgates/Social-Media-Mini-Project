import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { UserContext } from '../context/UserContext';
import Heart from "react-animated-heart";
import Comments from '../componant/Comments';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    <div className="home App">
      <div className="user-list">
        {users.map((post) => {
          const isLiked = post.likedBy && post.likedBy.includes(user.uid);
          return (
            <div
              onDoubleClick={() => toggleLike(post.id)}
              className="user-card"
              key={post.id}
            >
              <p>@{post.userName}</p>
              <img src={post.post} alt="" style={{height: "300px", width: "300px"}} />
              <p><b>Title: {post.postTitle}</b></p>
              <div className="like-section">
                <Heart
                  id={post.postId}
                  isClick={isLiked}
                  onClick={() => toggleLike(post.id)}
                  className="like-icon"
                />
                <p>{post.likes} Likes{post.likedBy.map(likedUser => likedUser === user.uid ? " you and others" : "")}</p>
              </div>
              <Comments postId={post.id} currentUser={user} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
