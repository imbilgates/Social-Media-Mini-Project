import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Heart from 'react-animated-heart';
import Comments from '../componant/Comments';
import logo from '../assets/img/default-img.jpg';
import useUsers from '../hooks/useUsers';

const Post = ({ post, user, toggleLike, loading, setLoading, setUsers }) => {
  const { allUsers } = useUsers();

  const fetchUserPfp = (userEmail) => {
    const user = allUsers.find(user => user.email === userEmail);
    return user ? user.photoURL : logo;
  };

  const fetchUserName = (userEmail) => {
    const user = allUsers.find(user => user.email === userEmail);
    return user ? user.displayName : "users";
  };

  const isLiked = post.likedBy && post.likedBy.includes(user.uid);

  return (
    <div onDoubleClick={() => toggleLike(post.id)} className="user-card" key={post.id}>
      <p style={{ display: 'flex', alignItems: 'center' }}>
        {loading ? (
          <>
            <Skeleton circle={true} height={50} width={50} style={{ marginRight: 10 }} />
            <span className="profile-name"><Skeleton width={100} /></span>
          </>
        ) : (
          <>
            <img
              src={fetchUserPfp(post.userEmail)}
              alt=""
              className="pfp-image"
              style={{ marginRight: 10 }}
            />
            <span className="profile-name">@{fetchUserName(post.userEmail)}</span>
          </>
        )}
      </p>
      {loading ? (
        <Skeleton height={300} width={'100%'} style={{ marginBottom: 10 }} />
      ) : (
        <img
          src={post.post}
          alt=""
          className="post-image"
          style={{ width: '100%', marginBottom: 10 }}
          onLoad={() => setLoading(false)}
        />
      )}
      <div className="post-content">
        <p>
          <b>{loading ? <Skeleton width={150} /> : `Title: ${post.postTitle}`}</b>
        </p>
        <div className="like-section">
          <Heart
            id={post.postId}
            isClick={isLiked}
            onClick={() => toggleLike(post.id)}
            className="like-icon"
          />
          {loading ? <Skeleton width={50} /> : (post.likedBy?.includes(user.uid) ? `${post.likedBy?.includes(user.uid && post.uid) ? "Liked by you" : `Liked by you & ${post.likes} others`}` : post.likes + " Likes")}
        </div>
        {loading ? <Skeleton width={100} /> : (
          <Comments
            postId={post.id}
            currentUser={user}
            commentsCount={post.commentsCount}
            setCommentsCount={(count) =>
              setUsers((users) =>
                users.map((p) => (p.id === post.id ? { ...p, commentsCount: count } : p))
              )}
          />
        )}
      </div>
    </div>
  );
};

export default Post;
