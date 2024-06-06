import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useState } from 'react'
import { auth, signInWithGoogle } from '../firebase';
import ReactLoading from 'react-loading';
import { AuthContexts } from '../context/AuthContexts';


const Login = () => {

    const [loading, setLoading] = useState(false);

    const { loginEmail,
        loginPassword,
        setLoginEmail,
        setLoginPassword,
        setIsClicked } = useContext(AuthContexts)

    const login = async () => {
        setLoading(true)
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );
            setLoading(false)
            console.log(userCredential.user);
        } catch (err) {
            setLoading(false)
            alert(err.message)
            console.error(err.message);
        }
    };


    return (
        <div className="login">
            <h3 className="login-heading">Login</h3>
            <input
                className="login-input"
                placeholder="Email.."
                onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
                className="login-input"
                placeholder="Password.."
                type="password"
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
    )
}

export default Login