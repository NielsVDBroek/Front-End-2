import './Content.scss';
import { useEffect, useState, useRef } from 'react';
import { auth, db, storage } from '../../config/firebase';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Posts from '../posts/Posts';
import Leaderboard from '../leaderboard/Leaderboard';
import { useNavigate } from "react-router-dom";

function Content() {
    const [currentView, setCurrentView] = useState('posts'); // Add state to track current view
    const dialogRef = useRef(null);

    const navigate = useNavigate();

    const renderCurrentView = () => {
        if (currentView === 'posts') {
            return <Posts />;
        } else if (currentView === 'leaderboard') {
            return <Leaderboard />;
        }
    };

    return (
        <div className='Container'> 
            <div className='side-bar'>
                <button className="btn" onClick={() => setCurrentView('posts')}>Posts</button>
                <button className="btn" onClick={() => setCurrentView('leaderboard')}>Ranglijst</button>
            </div>
            {renderCurrentView()}
        </div>
    );
}

export default Content;
