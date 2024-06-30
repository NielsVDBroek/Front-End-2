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
    <header data-testid="header-test" className="mainHeader">
        <div>
        <Link to={'/'} id='cypress-test-home-button'>Home</Link>
      </div>
      <div>
        {currentUser ? (
          <Link to={'/account'}>
            {currentUser.displayName ? currentUser.displayName : currentUser.email}
          </Link>
        ) : (
          <Link to={'/login'} id='cypress-test-login-button'>Login</Link>
        )}
      </div>

    </header>
  );
}

export default MainHeader;
