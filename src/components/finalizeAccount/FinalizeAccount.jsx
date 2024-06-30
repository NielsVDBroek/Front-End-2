import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './FinalizeAccount.scss';

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
    <form data-testid="finalize-test" className='finalize-account-container' onSubmit={handleSubmit}>
      <div className='container-account-form'>
        <div className='Name'>
          <label>Username:</label>
          <input
            id='cypress-test-username-field'
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className='Profile-picture'>
          <label>Profile Picture:</label>
          <input className='profile-picture-upload' type="file" onChange={handlePhotoChange} />
        </div>
        <div className='bio'>
          <label>Bio:</label>
          <textarea className='bio-textarea' value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
        </div>
        <div className='prive-option'>
          <label>Private Account:</label>
          <input
            className='private-checkbox'
            type="checkbox"
            checked={privateAccount}
            onChange={(e) => setPrivateAccount(e.target.checked)}
          />
        </div>
        <button id='finalize-account-button' type="submit">Finalize Account</button>
      </div>
    </form>
  );
};

export default FinalizeAccount;
