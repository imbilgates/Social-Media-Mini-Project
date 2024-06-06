import React, { useState } from 'react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
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

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredPosts);
  };

  return (
    <div className=''>
      <h2>Search</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query"
          />
        </div>
        <button type="submit">Search</button>
      </form>
      <div>
        {results.length > 0 ? (
          results.map(post => (
            <div key={post.id} className='post'>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
