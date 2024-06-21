import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { auth, db, signInWithGoogle } from '../firebase';
import ReactLoading from 'react-loading';
import { AuthContexts } from '../context/AuthContexts';
import logo from '../assets/img/default-img.jpg';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
    const [loading, setLoading] = useState(false);

    const {
        loginEmail,
        loginPassword,
        setLoginEmail,
        setLoginPassword,
        setIsClicked
    } = useContext(AuthContexts);

    const login = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );
            const user = userCredential.user;
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
            alert(err.message);
            console.error(err.message);
        }
    };

    return (
        <div className="login">
            <h3 className="login-heading">Login</h3>
            <input
                className="login-input"
                placeholder="Email.."
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
                className="login-input"
                placeholder="Password.."
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="login-button" onClick={login}>
                {loading ? (
                    <ReactLoading type={'spin'} color={"#ffffff"} height={'20px'} width={'20px'} />
                ) : (
                    "Login"
                )}
            </button><br />
            <button className="link-button" onClick={() => setIsClicked(true)}>To Register</button><br /><br />
            <button className="login-with-google-btn" onClick={signInWithGoogle}>
                Sign In With Google
            </button>
        </div>
    );
};

export default Login;
