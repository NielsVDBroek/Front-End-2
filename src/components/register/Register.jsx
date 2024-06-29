import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import './Register.scss';

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log(auth?.currentUser?.email);

  const signIn = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/finalize-account');
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/finalize-account');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <main>
        <div className="container-regristreren">
          <form className="Registrer-container">
            <h1 className="Inlog-label">Inloggen</h1>
            <div className="Register-fields">
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="Register-fields">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button onClick={signIn}>Registreren</button>
            </div>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
