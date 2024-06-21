import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { UserContext } from '../context/UserContext';
import Heart from "react-animated-heart";
import Comments from '../componant/Comments';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const fetchUsers = async () => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const data = await getDocs(usersCollectionRef);
      const usersWithCommentsCount = await Promise.all(data.docs.map(async (doc) => {
        const postData = doc.data();
        const commentsCollectionRef = collection(db, 'users', doc.id, 'comments');
        const commentsData = await getDocs(commentsCollectionRef);
        return { ...postData, id: doc.id, commentsCount: commentsData.size };
      }));
      setUsers(usersWithCommentsCount);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false); // Set loading to false after data is fetched
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

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="Home">
      <div className="user-list">
        {loading ? (
          "Loading..."
        ) : (
          users.map((post) => {
            const isLiked = post.likedBy && post.likedBy.includes(user.uid);
            return (
              <div
                onDoubleClick={() => toggleLike(post.id)}
                className="user-card"
                key={post.id}
              >
                <p>@{post.userName}</p>
                <img
                  src={post.post}
                  alt=""
                  className="post-image"
                  style={{ width: '100%', marginBottom: 10 }}
                  onLoad={() => setLoading(false)}
                />
                <div className="post-content">
                  <p>
                    <b>Title: {post.postTitle}</b>
                  </p>
                  <div className="like-section">
                    <Heart
                      id={post.postId}
                      isClick={isLiked}
                      onClick={() => toggleLike(post.id)}
                      className="like-icon"
                    />
                     {post.likedBy?.includes(user.uid) ? `${post.likedBy?.includes(user.uid && post.uid) ?"Liked by you" : `Liked by you & ${post.likes} others`}` : post.likes + " Likes"}
                  </div>
                  <Comments
                    postId={post.id}
                    currentUser={user}
                    commentsCount={post.commentsCount}
                    setCommentsCount={(count) => 
                      setUsers((users) =>
                        users.map((p) => (p.id === post.id ? { ...p, commentsCount: count } : p))
                      )
                    }
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;