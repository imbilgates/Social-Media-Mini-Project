import { auth } from './firebase';
import Register from './componant/Register';
import Crud from './componant/Crud';
import Home from './Pages/Home'
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectRoute from './ProtectRoute/ProtectRoute';
import Nav from './Pages/Nav';
import About from './Pages/About';
import Help from './Pages/Help';
import AddPost from './Pages/AddPost';
import Search from './Pages/Search';
import PostPage from './Pages/PostPage';
import { navContext } from './context/NavContexts'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log(user)
    });
    return () => unsubscribe();
  }, [user]);



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <navContext.Provider value={{ user }}>
        <Nav />
      </navContext.Provider>

      <Routes>
        <Route path='*' element={!user && <Register />} />

        <Route element={<ProtectRoute user={user} />}>
          <Route path='empty' element={<Home />} >
            <Route path='search' element={<Search />} />
            <Route path='addPost' element={<AddPost />} />
            <Route path='PostPage' element={<PostPage />} />
        </ Route>
        
          <Route path='/Home' element={<Crud />} />
          <Route path='/about' element={<About />} >
          </Route>

          <Route path='/help' element={<Help />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;

