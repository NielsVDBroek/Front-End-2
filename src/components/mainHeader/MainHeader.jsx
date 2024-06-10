import React, { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { Link } from 'react-router-dom';
import './MainHeader.scss';

function MainHeader() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="mainHeader">
        <div>
        <Link to={'/'}>Home</Link>
      </div>
      <div>
        {currentUser ? (
          <Link to={'/account'}>
            {currentUser.displayName ? currentUser.displayName : currentUser.email}
          </Link>
        ) : (
          <Link to={'/register'}>Login</Link>
        )}
      </div>

    </header>
  );
}

export default MainHeader;
