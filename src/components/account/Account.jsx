import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";

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
    <div>
      <div>
        Username: {currentUser?.displayName}
      </div>
      <div>
        Email: {currentUser?.email}
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Account;
