import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useState } from 'react'
import ReactLoading from 'react-loading';
import { auth, signInWithGoogle } from '../firebase';
import { AuthContexts } from '../context/AuthContexts';

const Signup = () => {

  const [loading, setLoading] = useState(false);

  const { registerEmail,
    registerPassword,
    setRegisterEmail,
    setRegisterPassword,
    setIsClicked } = useContext(AuthContexts)


  const register = async () => {
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      setLoading(false)
      console.log(userCredential.user);
    } catch (err) {
      console.error(err.message);
      setLoading(false)
      if (err.message.toString() === "Firebase: Error (auth/email-already-in-use).") {
        alert("Email already in use")
      } else if (err.message.toString() === "Firebase: Error (auth/invalid-email).") {
        alert("Enter an email correctly")
      }
    }
  };

  return (
    <div className="sign-Up">
      <h3 className="sign-Up-heading">Register User</h3>
      <input
        className="sign-Up-input"
        placeholder="Email.."
        onChange={(e) => setRegisterEmail(e.target.value)}
      />
      <input
        className="sign-Up-input"
        placeholder="Password.."
        type="password"
        onChange={(e) => setRegisterPassword(e.target.value)}
      />
      <button className="sign-Up-button" onClick={register}>
        {loading ? (
          <ReactLoading type={'spin'} color={"#ffffff"} height={'20px'} width={'20px'} />
        ) : (
          "Register"
        )}</button><br />
      <button className="link-button" onClick={() => setIsClicked(false)}>To Login</button><br /><br />
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        Sign In With Google
      </button>
    </div>
  )
}

export default Signup