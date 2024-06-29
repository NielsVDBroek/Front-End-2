import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FinalizeAccount = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [bio, setBio] = useState('');
  const [privateAccount, setPrivateAccount] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      let photoURL = '';

      if (userPhoto) {
        const storageRef = ref(storage, `user_photos/${userId}`);
        await uploadBytes(storageRef, userPhoto);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'user_info', userId), {
        user_id: userId,
        user_name: userName,
        user_photo: photoURL,
        user_role: 'user',
        private: privateAccount,
        bio: bio,
        blocked_users: [],
        followed_users: [],
      });

      navigate('/account');
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setUserPhoto(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Photo:</label>
        <input type="file" onChange={handlePhotoChange} />
      </div>
      <div>
        <label>Bio:</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
      </div>
      <div>
        <label>Private Account:</label>
        <input
          type="checkbox"
          checked={privateAccount}
          onChange={(e) => setPrivateAccount(e.target.checked)}
        />
      </div>
      <button type="submit">Finalize Account</button>
    </form>
  );
};

export default FinalizeAccount;
