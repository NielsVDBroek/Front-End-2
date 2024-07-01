import './Posts.scss';
import { useEffect, useState, useRef } from 'react';
import { auth, db, storage } from '../../config/firebase';
import { getDocs, collection, query, where, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Post from '../post/Post';
import { useNavigate, Link } from "react-router-dom";

function Posts() {
    const [postsList, setPostsList] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostFile, setNewPostFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
    const dialogRef = useRef(null);

    const postsCollectionRef = collection(db, "posts");
    const userInfoCollectionRef = collection(db, "user_info");

    const navigate = useNavigate();

    useEffect(() => {
        getPostsList();
    }, []);

    const getPostsList = async () => {
        try {
            const data = await getDocs(postsCollectionRef);
            const postsData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            postsData.sort((a, b) => {
                const dateA = new Date(a.date_of_creation);
                const dateB = new Date(b.date_of_creation);
                return dateB - dateA;
            });

            setPostsList(postsData);
        } catch (err) {
            console.error(err);
        }
    };

    const createPost = async (e) => {
        e.preventDefault();
        const date = new Date();
        const user_id = auth?.currentUser?.uid;

        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        if (newPostContent === "") {
            console.error("Content is empty");
            return;
        }

        let fileUrl = null;
        let fileType = null;

        if (newPostFile) {
            const fileRef = ref(storage, `uploads/${newPostFile.name}-${Date.now()}`);
            await uploadBytes(fileRef, newPostFile);
            fileUrl = await getDownloadURL(fileRef);
            fileType = newPostFile.type.split('/')[0];
        }

        try {
            await addDoc(postsCollectionRef, {
                user_id: user_id,
                content: newPostContent,
                file_url: fileUrl,
                file_type: fileType,
                likes: [],
                comments: 0,
                date_of_creation: date.toISOString(),
            });
            setNewPostContent("");
            setNewPostFile(null);
            getPostsList();
            dialogRef.current.close();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async () => {
        try {
            // Search users by user_name
            const usersQuery = query(userInfoCollectionRef, where("user_name", ">=", searchQuery), where("user_name", "<=", searchQuery + "\uf8ff"));
            const usersSnapshot = await getDocs(usersQuery);
            const users = usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            // Search posts by content
            const postsQuery = query(postsCollectionRef, where("content", ">=", searchQuery), where("content", "<=", searchQuery + "\uf8ff"));
            const postsSnapshot = await getDocs(postsQuery);
            const posts = postsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            setSearchResults({ users, posts });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div data-testid="posts-test" className='Container-posts'> 
            <div>
                <input 
                    type="text" 
                    value={searchQuery} 
                    placeholder="Search for users or posts..." 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div>
                <dialog id="my_modal_1" className="modal" ref={dialogRef}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">Maak je post</p>
                        <div className="modal-action">
                            <form method="dialog" className='post-form' onSubmit={createPost}>
                                <input 
                                    type="text" 
                                    value={newPostContent} 
                                    placeholder='Post content...' 
                                    onChange={(e) => setNewPostContent(e.target.value)} 
                                    required 
                                />
                                <input 
                                    type="file" 
                                    accept="image/*,video/*" 
                                    onChange={(e) => setNewPostFile(e.target.files[0])} 
                                />
                                <button className="btn" type="button" onClick={() => dialogRef.current.close()}>Close</button>
                                <button id='cypress-test-submit-post' type="submit">Post</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <button className="maak-post-btn" onClick={() => dialogRef.current.showModal()}>Maak post</button>
            </div>
            <div className='search-results'>
                <h3>Search Results:</h3>
                <div className='users-results'>
                    <h4>Users:</h4>
                    {searchResults.users.map((user) => (
                        <div key={user.id}>
                            <Link to={`/view-account/${user.user_id}`}>
                                <p>{user.user_name}</p>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className='posts-results'>
                    <h4>Posts:</h4>
                    {searchResults.posts.map((post) => (
                        <Post key={post.id} post={post} onPostUpdate={getPostsList} onPostDelete={getPostsList} />
                    ))}
                </div>
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
