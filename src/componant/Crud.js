import { useState, useEffect } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Crud() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
      await addDoc(usersCollectionRef, { name: newName, age: Number(newAge) });
  };

  const updateUser = async (id, age) => {
      const userDoc = doc(db, "users", id);
      const newFields = { age: age + 1 };
      await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
      const userDoc = doc(db, "users", id);
      await deleteDoc(userDoc);
  };

  useEffect(() => {
      const getUsers = async () => {
          const data = await getDocs(usersCollectionRef);
          setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      };
      getUsers();
}, [users, usersCollectionRef]);

  return (
      <div className="app">
          <div className="input-container">
              <input
                  className="input-field"
                  placeholder="Name..."
                  onChange={(e) => setNewName(e.target.value)}
              />
              <input
                  className="input-field"
                  type="number"
                  placeholder="Age..."
                  onChange={(e) => setNewAge(e.target.value)}
              />
              <button className="create-button" onClick={createUser}>Create User</button>
          </div>

          <div className="user-list">
              {users.map((user) => (
                  <div className="user-card" key={user.id}>
                      <h1 className="user-name">Name: {user.name}</h1>
                      <h1 className="user-age">Age: {user.age}</h1>
                      <button className="update-button" onClick={() => updateUser(user.id, user.age)}>Increase Age</button>
                      <button className="delete-button" onClick={() => deleteUser(user.id)}>Delete User</button>
                  </div>
              ))}
          </div>
      </div>
  );
}

export default Crud;