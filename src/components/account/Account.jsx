import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { Link } from 'react-router-dom';

function Account() {
    const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div>
        {currentUser ? (
          <Link to={'/account'}>
            {currentUser.displayName ? currentUser.displayName : currentUser.email}
          </Link>
        ) : (
          <Link to={'/register'}>Login</Link>
        )}
      </div>
            <button onClick={logout}>Logout</button>
        </div>
        
    );
}

export default Account;
