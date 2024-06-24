import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import './Account.scss';


function Account() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        console.log("User not logged in");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return(
    <div className="Account-container">
      <div className="Container-user">
        <div className="back-bar">
          <button className="Back-btn" onClick={() => navigate(-1)}>&#129028;</button>
          {currentUser?.displayName}
        </div>
        <div className="Banner">Banner</div>
        <div className="Userinfo">
          <div className="Username">
            {currentUser?.displayName}
          </div>
          <div className="Email">
            {currentUser?.email}
          </div>
        </div>
        <button className="Logout-btn" onClick={logout}>Logout</button>
      </div>
      <div className="Container-posts">
        //laat hier de posts van de gebruiker zien
      </div>
    </div>
  );
}

export default Account;
