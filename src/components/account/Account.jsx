import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from '../../config/firebase';
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Post from '../post/Post';
import './Account.scss';

function Account() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userPostsList, setUserPostsList] = useState([]);
  const [userInfo, setUserInfo] = useState({
    user_name: '',
    user_photo: '',
    bio: '',
    private: false,
  });
  const [userPhotoFile, setUserPhotoFile] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserInfo(user.uid);
      } else {
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

  const fetchUserInfo = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "user_info", uid));
      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
      } else {
        navigate('/finalize-account');
      }
    } catch (err) {
      console.error("Error fetching user info: ", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setUserPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = currentUser.uid;
    let photoURL = userInfo.user_photo;

    if (userPhotoFile) {
      const storageRef = ref(storage, `user_photos/${userId}`);
      await uploadBytes(storageRef, userPhotoFile);
      photoURL = await getDownloadURL(storageRef);
    }

    try {
      await updateDoc(doc(db, "user_info", userId), {
        user_name: userInfo.user_name,
        user_photo: photoURL,
        bio: userInfo.bio,
        private: userInfo.private,
      });
      alert("Information updated successfully!");
    } catch (err) {
      console.error("Error updating user info: ", err);
    }
  };

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
          {userInfo && (
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="user_name"
                  value={userInfo.user_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Photo:</label>
                <input
                  type="file"
                  onChange={handlePhotoChange}
                />
                {userInfo.user_photo && <img src={userInfo.user_photo} alt="User" style={{ width: '50px', height: '50px' }} />}
              </div>
              <div>
                <label>Bio:</label>
                <textarea
                  name="bio"
                  value={userInfo.bio}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div>
                <label>Private Account:</label>
                <input
                  type="checkbox"
                  name="private"
                  checked={userInfo.private}
                  onChange={(e) => setUserInfo((prevInfo) => ({
                    ...prevInfo,
                    private: e.target.checked,
                  }))}
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          )}
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
