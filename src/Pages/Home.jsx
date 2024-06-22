import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { UserContext } from '../context/UserContext';
import Post from '../componant/Post';
import 'react-loading-skeleton/dist/skeleton.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserContext);

  const fetchUsers = async () => {
    try {
      setLoading(true);
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="Home">
      <div className="user-list">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Post key={index} post={{}} user={user} toggleLike={toggleLike} loading={loading} setLoading={setLoading} />
          ))
        ) : (
          users.map((post) => (
            <Post key={post.id} post={post} user={user} toggleLike={toggleLike} loading={loading} setLoading={setLoading} setUsers={setUsers} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
