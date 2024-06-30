import './Leaderboard.scss';
import { useEffect, useState, useRef } from 'react';
import { auth, db } from '../../config/firebase';
import { getDocs, collection, addDoc, query, where, updateDoc, doc } from 'firebase/firestore';

function Leaderboard() {
    const [leaderboardList, setLeaderboardList] = useState([]);
    const [newEntryTime, setNewEntryTime] = useState("");
    const dialogRef = useRef(null);

    const leaderboardCollectionRef = collection(db, "leaderboard");
    const usersCollectionRef = collection(db, "user_info");

    useEffect(() => {
        getLeaderboardList();
    }, []);

    const getLeaderboardList = async () => {
        try {
            const data = await getDocs(leaderboardCollectionRef);
            let leaderboardData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            leaderboardData = await Promise.all(leaderboardData.map(async (entry) => {
                const userDoc = await getDocs(query(usersCollectionRef, where("user_id", "==", entry.user_id)));
                const userData = userDoc.docs[0]?.data();
                return { ...entry, username: userData?.user_name || "Unknown User" };
            }));

            leaderboardData.sort((a, b) => a.time - b.time); // Sort by time in ascending order

            setLeaderboardList(leaderboardData);
        } catch (err) {
            console.error(err);
        }
    };

    const createEntry = async (e) => {
        e.preventDefault();
        const user_id = auth?.currentUser?.uid;

        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        if (!/^\d{1,2}:\d{2}:\d{2}$/.test(newEntryTime)) {
            console.error("Invalid time format. Please use hh:mm:ss.");
            return;
        }

        const [hours, minutes, seconds] = newEntryTime.split(':').map(Number);
        const newTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;

        try {
            const userDoc = await getDocs(query(usersCollectionRef, where("user_id", "==", user_id)));
            const userData = userDoc.docs[0]?.data();
            const username = userData?.username || "Unknown User";

            // Query to see if the user already has an entry
            const q = query(leaderboardCollectionRef, where("user_id", "==", user_id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // User has an existing entry
                const existingEntry = querySnapshot.docs[0];
                const existingTime = existingEntry.data().time;

                if (newTimeInSeconds < existingTime) {
                    // Update the existing entry if the new time is better
                    const entryDoc = doc(db, "leaderboard", existingEntry.id);
                    await updateDoc(entryDoc, { time: newTimeInSeconds });
                }
            } else {
                // User does not have an existing entry, create a new one
                await addDoc(leaderboardCollectionRef, {
                    user_id: user_id,
                    username: username,
                    time: newTimeInSeconds,
                });
            }

            setNewEntryTime("");
            getLeaderboardList();
            dialogRef.current.close(); // Close the modal after successful submission
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='Container'>
            <div>
                <button className="btn" onClick={() => dialogRef.current.showModal()}>Add Entry</button>
                <dialog id="leaderboard_modal" className="modal" ref={dialogRef}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">Add your time</p>
                        <div className="modal-action">
                            <form method="dialog" className='entry-form' onSubmit={createEntry}>
                                <input 
                                    type="text" 
                                    value={newEntryTime} 
                                    placeholder='hh:mm:ss' 
                                    onChange={(e) => setNewEntryTime(e.target.value)} 
                                    pattern="\d{1,2}:\d{2}:\d{2}"
                                    required
                                />
                                <button className="btn" type="button" onClick={() => dialogRef.current.close()}>Close</button>
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
            <div className='leaderboard-item-container'>
                {leaderboardList.map((entry) => (
                    <div key={entry.id} className='leaderboard-item'>
                        <p>User ID: {entry.user_id}</p>
                        <p>Username: {entry.username}</p>
                        <p>Time: {Math.floor(entry.time / 3600)}:{String(Math.floor((entry.time % 3600) / 60)).padStart(2, '0')}:{String(entry.time % 60).padStart(2, '0')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Leaderboard;
