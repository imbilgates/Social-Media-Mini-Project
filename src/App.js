import { auth } from './firebase';
import Register from './componant/Register';
import Crud from './componant/Crud';
import Home from './Pages/Home';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import ProtectRoute from './ProtectRoute/ProtectRoute';
import Nav from './Pages/Nav';
import About from './Pages/About';
import Help from './Pages/Help';
import AddPost from './Pages/AddPost';
import Search from './Pages/Search';
import Update from './componant/Update';
import { UserContext } from './context/UserContext'; 
import UserProfile from './componant/UserProfile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser  }}> 

        <Nav />

      <Routes>
        <Route path="*" element={!user ? <Register /> : <Navigate to="/home" />} />
        
        <Route element={<ProtectRoute user={user} />}>
          <Route path="/home" element={<Home />}>
            <Route path="search" element={<Search />} />
            <Route path="addPost" element={<AddPost />} />
          </Route>

          <Route path="/Profile" element={<UserProfile />} />
          
          <Route path="/crud" element={<Crud />} />
          <Route path="/crud/update/:id" element={<Update />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
      
    </UserContext.Provider>
  );
}

export default App;
