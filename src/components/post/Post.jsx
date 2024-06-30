import React, { useState, useEffect } from 'react';
import { auth, db } from '../../config/firebase';
import { doc, deleteDoc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Post.scss';

function Post({ post, onPostUpdate, onPostDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPostContent, setUpdatedPostContent] = useState(post.content);
    const [authorInfo, setAuthorInfo] = useState(null);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const user_id = auth?.currentUser?.uid;

    useEffect(() => {
        const fetchAuthorInfo = async () => {
            try {
                const authorDoc = await getDoc(doc(db, "user_info", post.user_id));
                if (authorDoc.exists()) {
                    setAuthorInfo(authorDoc.data());
                }
            } catch (err) {
                console.error("Error fetching author info: ", err);
            }
        };

        const fetchLikes = async () => {
            try {
                const postDoc = await getDoc(doc(db, "posts", post.id));
                if (postDoc.exists()) {
                    setLikes(postDoc.data().likes || []);
                }
            } catch (err) {
                console.error("Error fetching likes: ", err);
            }
        };

        fetchAuthorInfo();
        fetchLikes();
    }, [post.user_id, post.id]);

    useEffect(() => {
        let unsubscribe;
        if (showComments) {
            const commentsQuery = collection(db, "posts", post.id, "comments");
            unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
                const commentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setComments(commentsList);
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [showComments, post.id]);

    const updatePost = async (id, updatedContent) => {
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
        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const postDoc = doc(db, "posts", id);
            const postSnapshot = await getDoc(postDoc);

            if (postSnapshot.exists() && postSnapshot.data().user_id === user_id) {
                await deleteDoc(postDoc);
                onPostDelete(id);
            } else {
                console.error("You are not authorized to delete this post");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLike = async () => {
        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        const postDoc = doc(db, "posts", post.id);

        try {
            if (likes.includes(user_id)) {
                // Remove like
                await updateDoc(postDoc, {
                    likes: arrayRemove(user_id)
                });
                setLikes(likes.filter(like => like !== user_id));
            } else {
                // Add like
                await updateDoc(postDoc, {
                    likes: arrayUnion(user_id)
                });
                setLikes([...likes, user_id]);
            }
        } catch (err) {
            console.error("Error updating likes: ", err);
        }
    };

    const handleAddComment = async () => {
        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const commentsCollection = collection(db, "posts", post.id, "comments");
            await addDoc(commentsCollection, {
                user_id,
                content: newComment,
                timestamp: new Date()
            });
            setNewComment('');
        } catch (err) {
            console.error("Error adding comment: ", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!user_id) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const commentDoc = doc(db, "posts", post.id, "comments", commentId);
            const commentSnapshot = await getDoc(commentDoc);

            if (commentSnapshot.exists() && commentSnapshot.data().user_id === user_id) {
                await deleteDoc(commentDoc);
            } else {
                console.error("You are not authorized to delete this comment");
            }
        } catch (err) {
            console.error("Error deleting comment: ", err);
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    return (
        <div data-testid="post-test" className="post-item">
            <div onClick={toggleComments}>
                <div className="post-header">
                    {authorInfo && (
                        <Link to={`/view-account/${post.user_id}`} className="username-link">
                            {authorInfo.user_name}
                        </Link>
                    )}
                </div>
                {post.content && <div className='Post-content'>{post.content}</div>}
                {post.file_url && post.file_type === "image" && <img className='media-size' src={post.file_url} alt="Post media" />}
                {post.file_url && post.file_type === "video" && <video className='media-size' src={post.file_url} controls />}
            </div>
            <div className='Button-container'>
                <button className='likeBtn' onClick={handleLike}>
                    {likes.includes(user_id) ? 'Unlike' : 'Like'}
                </button>
                <div className='Likes'>{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</div>
                {post.user_id === user_id && !isEditing && (
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
            {showComments && (
                <div className="comments-section">
                    <div className="comments-list">
                        {comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                <p>{comment.content}</p>
                                {comment.user_id === user_id && (
                                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="add-comment">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button onClick={handleAddComment}>Post</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Post;
