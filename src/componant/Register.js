import React, { useState } from 'react';
import '../App.css'
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import { AuthContexts } from '../context/AuthContexts';

const Register = () => {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const obj = {
    loginEmail,
    loginPassword,
    registerEmail,
    registerPassword,
    isClicked,
    setLoginEmail,
    setLoginPassword,
    setRegisterEmail,
    setRegisterPassword,
    setIsClicked
  }


  return (
    <div className="Home">
      <AuthContexts.Provider value={obj}>
        {isClicked ? <Signup /> : <Login />}
      </AuthContexts.Provider>
    </div>
  );
}

export default Register;
