import './Posts.scss'
import { useEffect, useState } from 'react'
import { auth } from '../../config/firebase';
import { db } from '../../config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';

function Posts(){
    const [postsList, setPostsList] = useState([]);

    const [newPostContent, setNewPostContent] = useState("");

    const postsCollectionRef = collection(db, "posts")

    useEffect(() => {
        getPostsList();
      }, [])

    const getPostsList = async () => {
        try{
          const data = await getDocs(postsCollectionRef)
          const filteredData = data.docs.map((doc) => ({...doc.data(),
             id: doc.id}))
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

        if (newPostContent == "") {
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
              getPostsList();
          } else {
              console.error("You are not authorized to delete this post");
          }
      } catch (err) {
          console.error(err);
      }
  };
  

    return(
        <div>
          <div>
            <input type="text" placeholder='Post content...' onChange={(e) => setNewPostContent(e.target.value)}/>
            <button onClick={createPost}>Submit</button>
          </div>
          <div>
            {postsList.map((posts) => (
              <div className="post-item" key={posts.id}>
                  <div>{posts.user_id}</div>
                  <div>{posts.content}</div>
                  <div>{posts.likes}</div>
                  <div>{posts.comments}</div>
                  
                  <button onClick={() => deletePost(posts.id)}>Delete test</button>
              </div>
            ))}
          </div>
        </div>
        
    )

}

export default Posts;