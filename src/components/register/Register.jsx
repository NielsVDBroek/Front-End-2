import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth, googleProvider, db } from '../../config/firebase'; // Adjust the path as needed
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Register.scss';

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/finalize-account');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, 'user_info', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        navigate('/account');
      } else {
        navigate('/finalize-account');
      }
    } catch (err) {
      console.error('Error signing in with Google:', err);
    }
  };

  return (
    <>
      <main>
        <div data-testid="register-test" className="container-regristreren">
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

            <div className="Register-fields">
              <button onClick={signIn}>Registreren</button>
            </div>
            <button type="button" onClick={signInWithGoogle}>Sign in with Google</button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
