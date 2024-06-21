import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import ReactLoading from 'react-loading';
import { auth, db, signInWithGoogle } from '../firebase';
import { AuthContexts } from '../context/AuthContexts';
import { doc, setDoc } from 'firebase/firestore';
import logo from '../assets/img/default-img.jpg';

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const { registerEmail, registerPassword, setRegisterEmail, setRegisterPassword, setIsClicked } = useContext(AuthContexts);

  const register = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;

      // Update Firestore document
      const userRef = doc(db, "users-log", user.uid);
      await setDoc(userRef, {
        displayName: user.displayName || "user",
        email: user.email,
        photoURL: user.photoURL || logo,
        uid: user.uid,
        lastLogin: new Date().toISOString()
      }, { merge: true });

      setLoading(false);
      console.log(user);
    } catch (err) {
      setLoading(false);
      console.error(err.message);
      if (err.message.toString() === "Firebase: Error (auth/email-already-in-use).") {
        alert("Email already in use");
      } else if (err.message.toString() === "Firebase: Error (auth/invalid-email).") {
        alert("Enter an email correctly");
      }
    }
  };

  return (
    <div className="sign-Up">
      <h3 className="sign-Up-heading">Register User</h3>
      <input
        className="sign-Up-input"
        placeholder="Email.."
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
      />
      <input
        className="sign-Up-input"
        placeholder="Password.."
        type="password"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
      />
      <button className="sign-Up-button" onClick={register}>
        {loading ? (
          <ReactLoading type={'spin'} color={"#ffffff"} height={'20px'} width={'20px'} />
        ) : (
          "Register"
        )}
      </button><br />
      <button className="link-button" onClick={() => setIsClicked(false)}>To Login</button><br /><br />
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        Sign In With Google
      </button>
    </div>
  );
};

export default Signup;
