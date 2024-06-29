import { useState } from 'react';
import { auth, db } from '../../config/firebase';
import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import './Post.scss';

function Post({ post, onPostUpdate, onPostDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPostContent, setUpdatedPostContent] = useState(post.content);

    const updatePost = async (id, updatedContent) => {
        const user_id = auth?.currentUser?.uid;
        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const postDoc = doc(db, "posts", id);
            const postSnapshot = await getDoc(postDoc);

            if (postSnapshot.exists() && postSnapshot.data().user_id === user_id) {
                await updateDoc(postDoc, { content: updatedContent });
                onPostUpdate();
            } else {
                console.error("You are not authorized to update this post");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deletePost = async (id) => {
        const user_id = auth?.currentUser?.uid;
        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const postDoc = doc(db, "posts", id);
            const postSnapshot = await getDoc(postDoc);

            if (postSnapshot.exists() && postSnapshot.data().user_id === user_id) {
                await deleteDoc(postDoc);
                onPostDelete();
            } else {
                console.error("You are not authorized to delete this post");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="post-item">
            {post.content && <div className='Post-content'>{post.content}</div>}
            {post.file_url && post.file_type === "image" && <img className='media-size' src={post.file_url} alt="Post media" />}
            {post.file_url && post.file_type === "video" && <video className='media-size' src={post.file_url} controls />}
            <div className='Button-container'>
                {post.user_id === auth?.currentUser?.uid && !isEditing && (
                    <div className='user-buttons2332'>
                        <button className='Btnpost' onClick={() => { setIsEditing(true); }}>Edit</button>
                        <button className='Btnpost' onClick={() => deletePost(post.id)}>Delete</button>
                    </div>
                )}
                {isEditing && (
                    <div className='edit-menu'>
                        <input type="text" value={updatedPostContent} onChange={(e) => setUpdatedPostContent(e.target.value)} />
                        <button onClick={() => { updatePost(post.id, updatedPostContent); setIsEditing(false); }}>Save</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Post;
