import Register from './componant/Register';
import Crud from './componant/Crud';
import Home from './Pages/Home';
import './App.css';
import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import ProtectRoute from './ProtectRoute/ProtectRoute';
import Nav from './Pages/Nav';
import About from './Pages/About';
import Chat from './Pages/Chat';
import AddPost from './Pages/AddPost';
import Search from './Pages/Search';
import Update from './componant/Update';
import { UserContext } from './context/UserContext'; 
import UserProfile from './componant/UserProfile';


function App() {

    const { user, loading } = useContext(UserContext);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <>
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
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </>
    );
  };
  

  export default App;