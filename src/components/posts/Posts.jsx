

function Posts(){
    const [postsList, setPostsList] = useState([]);

    // const [newTestName, setNewTestName] = useState("");
    // const [newTestInfo, setNewTestInfo] = useState("");

    // const [updateTestName, setUpdateTestName] = useState("");
    // const [updateTestInfo, setUpdateTestInfo] = useState("");

    const postsCollectionRef = collection(db, "posts")

    useEffect(() => {
        getTestList();
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
        try {
          await addDoc(postsCollectionRef, {
            user_id: newTestName, 
            content: newTestInfo,
            likes: 0,
            comments: 0,
          });
    
          getPostsList();
        } catch(err){
          console.error(err);
        }
    }

    const deletePost = async (id) => {
        const postsDoc = doc(db, "posts", id);
        await deleteDoc(postsDoc)
        getTestList();
    }

    // const updatePost = async (id) => {
    //     const postsDoc = doc(db, "posts", id);
    //     await updateDoc(postsDoc, {
    //         // 
    //     })
    //     getTestList();
    // }

    return(
        <div>
          {postsList.map((posts) => (
            <div className="post-item">
                <div>{posts.user_id}</div>
                <div>{posts.content}</div>
                <div>{posts.likes}</div>
                <div>{posts.comments}</div>
            </div>
          ))}
        </div>
    )

}

export default Posts;