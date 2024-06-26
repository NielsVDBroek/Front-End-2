import './Posts.scss';
import { useEffect, useState } from 'react';
import { auth, db } from '../../config/firebase';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import Post from '../post/Post';
function Posts() {
    const [postsList, setPostsList] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");

    const postsCollectionRef = collection(db, "posts");

    useEffect(() => {
        getPostsList();
    }, []);

    const getPostsList = async () => {
        try {
            const data = await getDocs(postsCollectionRef);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setPostsList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    const createPost = async () => {
        const user_id = auth?.currentUser?.uid;
        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        if (newPostContent === "") {
            console.error("Content is empty");
            return;
        }

        try {
            await addDoc(postsCollectionRef, {
                user_id: user_id,
                content: newPostContent,
                likes: 0,
                comments: 0,
            });
            setNewPostContent("");
            getPostsList();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='Container'>
            <div>
                <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>Maak post</button>
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">Maak je post</p>
                        <div className="modal-action">
                            <form method="dialog" className='post-form'>
                                <input type="text" placeholder='Post content...' onChange={(e) => setNewPostContent(e.target.value)} />
                                <button className="btn">Close</button>
                                <button type="button" onClick={createPost}>Post</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
            <div className='post-item-container'>
                {postsList.map((post) => (
                    <Post key={post.id} post={post} onPostUpdate={getPostsList} onPostDelete={getPostsList} />
                ))}
            </div>
        </div>
    );
}

export default Posts;
