import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from '../../config/firebase';
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Post from '../post/Post';
import './Account.scss';

function Account() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userPostsList, setUserPostsList] = useState([]);

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

  useEffect(() => {
    if (currentUser) {
      getUserPostsList(currentUser.uid);
    }
  }, [currentUser]);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const getUserPostsList = async (uid) => {
    try {
      const q = query(collection(db, "posts"), where("user_id", "==", uid));
      const querySnapshot = await getDocs(q);
      
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUserPostsList(postsData);
    } catch (err) {
      console.error("Error fetching user posts: ", err);
    }
  };

  return (
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
        {userPostsList.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Account;
