import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { auth, googleProvider } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import './Register.scss';

export const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(auth?.currentUser?.email);

    const signIn = async () => {
        try{
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
        } catch(err) {
            console.log(err);
        }
    };

    const signInWithGoogle = async () => {
        try{
        await signInWithPopup(auth, googleProvider);
        navigate("/");
        } catch(err) {
            console.log(err);
        }
    };


    return (
        <div>
            <input placeholder="Email..." type="email" onChange={(e) => setEmail(e.target.value)} required/>
            <input placeholder="Password..." type="password" onChange={(e) => setPassword(e.target.value)} required/>
            <button onClick={signIn}>Sign in</button>
            <button onClick={signInWithGoogle}>Sign in with Google</button>

            <Link to={'/login'}>Al een account? Login.</Link>
            
        </div>
    );
};

export default Register;