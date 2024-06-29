import './Leaderboard.scss';
import { useEffect, useState } from 'react';
import { auth, db } from '../../config/firebase';
import { getDocs, collection, addDoc } from 'firebase/firestore';

function Leaderboard() {
    const [leaderboardList, setLeaderboardList] = useState([]);
    const [newEntryTime, setNewEntryTime] = useState("");

    const leaderboardCollectionRef = collection(db, "leaderboard");

    useEffect(() => {
        getLeaderboardList();
    }, []);

    const getLeaderboardList = async () => {
        try {
            const data = await getDocs(leaderboardCollectionRef);
            const leaderboardData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            
            leaderboardData.sort((a, b) => a.time - b.time); // Sort by time in ascending order
            
            setLeaderboardList(leaderboardData);
        } catch (err) {
            console.error(err);
        }
    };

    const createEntry = async () => {
        const user_id = auth?.currentUser?.uid;

        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        if (newEntryTime === "" || isNaN(newEntryTime)) {
            console.error("Invalid time");
            return;
        }

        try {
            await addDoc(leaderboardCollectionRef, {
                user_id: user_id,
                time: parseFloat(newEntryTime),
            });
            setNewEntryTime("");
            getLeaderboardList();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='Container'>
            <div>
                <button className="btn" onClick={() => document.getElementById('leaderboard_modal').showModal()}>Add Entry</button>
                <dialog id="leaderboard_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">Add your time</p>
                        <div className="modal-action">
                            <form method="dialog" className='entry-form'>
                                <input 
                                    type="text" 
                                    value={newEntryTime} 
                                    placeholder='Time...' 
                                    onChange={(e) => setNewEntryTime(e.target.value)} 
                                />
                                <button className="btn">Close</button>
                                <button type="button" onClick={createEntry}>Submit</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
            <div className='leaderboard-item-container'>
                {leaderboardList.map((entry) => (
                    <div key={entry.id} className='leaderboard-item'>
                        <p>User: {entry.user_id}</p>
                        <p>Time: {entry.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Leaderboard;
