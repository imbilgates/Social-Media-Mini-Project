import React from 'react';

const PostPage = () => {
  // Sample posts data
  const posts = [
    {
      id: 1,
      title: "First Post",
      content: "This is the content of the first post."
    },
    {
      id: 2,
      title: "Second Post",
      content: "This is the content of the second post."
    },
    {
      id: 3,
      title: "Third Post",
      content: "This is the content of the third post."
    }
  ];

  return (
    <div className=''>
      <h2>Posts</h2>
      <div>
        {posts.map(post => (
          <div key={post.id} className='post'>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
