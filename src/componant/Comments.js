import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const Comments = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const fetchComments = async () => {
    try {
      const commentsCollectionRef = collection(db, 'users', postId, 'comments');
      const data = await getDocs(commentsCollectionRef);
      setComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const postComment = async () => {
    try {
      if (newComment.trim() === '') return;
      const commentsCollectionRef = collection(db, 'users', postId, 'comments');
      await addDoc(commentsCollectionRef, {
        text: newComment,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        timestamp: new Date(),
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const commentDocRef = doc(db, 'users', postId, 'comments', commentId);
      await deleteDoc(commentDocRef);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, fetchComments]);

  return (
    <div className="comment-section">
      <i
        className="bx bxs-chat comment-toggle-icon"
        onClick={() => setShowComments(!showComments)}
      ></i>
      {showComments && (
        <>
          <div className="comments">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p><b>{comment.userName}:</b> {comment.text}</p>
                {comment.userId === currentUser.uid && (
                  <button onClick={() => deleteComment(comment.id)} className="delete-comment-button">Delete</button>
                )}
              </div>
            ))}
          </div>
          <div className="comment-input">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="comment-input-field"
            />
            <button onClick={postComment} className="post-comment-button">Post</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
