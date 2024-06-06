import React from 'react';

const AddPost = () => {
  return (
    <div className=''>
      <h2>Add a New Post</h2>
      <form>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" placeholder="Enter post title" />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" name="content" placeholder="Enter post content"></textarea>
        </div>
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
};

export default AddPost;
