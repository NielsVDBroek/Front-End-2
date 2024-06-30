import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Post from "../post/Post";
import './ViewAccount.scss';

function ViewAccount() {
  const { userId } = useParams();
  const [userPostsList, setUserPostsList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userDoc = await getDoc(doc(db, "user_info", userId));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.error("User not found");
        }
      } catch (err) {
        console.error("Error fetching user info: ", err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const q = query(collection(db, "posts"), where("user_id", "==", userId));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserPostsList(postsData); // Update state with fetched posts
      } catch (err) {
        console.error("Error fetching user posts: ", err);
      }
    };

    fetchUserInfo();
    fetchUserPosts();
  }, [userId]);

  return (
    <div className="ViewAccount-container">
      {userInfo && (
        <div className="Container-user">
          <div className="back-bar">
            <Link to="/">&#129044; Back</Link>
            {userInfo.user_name}'s Account
          </div>
          <div className="Userinfo">
            <div className="Username">{userInfo.user_name}</div>
            <div className="Bio">{userInfo.bio}</div>
            {userInfo.user_photo && (
              <div className="Userphoto">
                <img src={userInfo.user_photo} alt="User" />
              </div>
            )}
          </div>
          <div className="Container-posts">
            {userPostsList.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAccount;
