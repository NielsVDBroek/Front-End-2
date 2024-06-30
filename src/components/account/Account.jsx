import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from '../../config/firebase';
import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from "firebase/firestore";
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
  const [formInfo, setFormInfo] = useState({
    user_name: '',
    user_photo: '',
    bio: '',
    private: false,
  });
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

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
        setFormInfo(userDoc.data());
      } else {
        navigate('/finalize-account');
      }
    } catch (err) {
      console.error("Error fetching user info: ", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInfo((prevInfo) => ({
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
    let photoURL = formInfo.user_photo;

    if (userPhotoFile) {
      const storageRef = ref(storage, `user_photos/${userId}`);
      await uploadBytes(storageRef, userPhotoFile);
      photoURL = await getDownloadURL(storageRef);
    }

    try {
      await updateDoc(doc(db, "user_info", userId), {
        user_name: formInfo.user_name,
        user_photo: photoURL,
        bio: formInfo.bio,
        private: formInfo.private,
      });

      await updateProfile(currentUser, {
        displayName: formInfo.user_name,
        photoURL: photoURL
      });

      setCurrentUser({
        ...currentUser,
        displayName: formInfo.user_name,
        photoURL: photoURL
      });

      setUserInfo((prevInfo) => ({
        ...prevInfo,
        user_name: formInfo.user_name,
        user_photo: photoURL,
        bio: formInfo.bio,
        private: formInfo.private,
      }));
      
      setIsFormVisible(false);
      
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

      console.log("Fetched posts:", postsData);

      setUserPostsList(postsData);
    } catch (err) {
      console.error("Error fetching user posts: ", err);
    }
  };

  const handlePostDelete = (id) => {
    setUserPostsList((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  return (
    <div className="Account-container">
      <div className="Container-user">
        <div className="back-bar">
          <button className="Back-btn" onClick={() => navigate(-1)}>&#129028;</button>
          {currentUser?.displayName}
        </div>
        <div className="Userinfo">
          <div className="Profile-picture-account">
            {userInfo.user_photo && <img src={userInfo.user_photo} alt="User" style={{ width: '50px', height: '50px' }} />}
          </div>
          <div className="Username">
            {currentUser?.displayName}
          </div>
          <div className="Email">
            {currentUser?.email}
          </div>
          <div className="Bio">
            {userInfo.bio}
          </div>
          <button className="Button-color-green" onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? "Hide Form" : "Edit Information"}
          </button>
          {isFormVisible && (
            <form className="accont-information-form" onSubmit={handleSubmit}>
              <div className="Name">
                <label>Username:</label>
                <input
                  type="text"
                  name="user_name"
                  value={formInfo.user_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='Profile-picture'>
                <label>Profile Picture:</label>
                <input
                  className='profile-picture-upload'
                  type="file"
                  onChange={handlePhotoChange}
                />
              </div>
              <div>
                <label>Bio:</label>
                <textarea
                  className="bio-textarea"
                  name="bio"
                  value={formInfo.bio}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className='prive-option'>
                <label>Private Account:</label>
                <input
                  className='private-checkbox'
                  type="checkbox"
                  name="private"
                  checked={formInfo.private}
                  onChange={(e) => setFormInfo((prevInfo) => ({
                    ...prevInfo,
                    private: e.target.checked,
                  }))}
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
        <button className="Logout-btn Button-color-green" onClick={logout}>Logout</button>
      </div>
      <div className="Container-posts-account">
        {userPostsList.length > 0 ? (
          userPostsList.map((post) => (
            <Post key={post.id} post={post} onPostDelete={() => handlePostDelete(post.id)} />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default Account;
