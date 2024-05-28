import { useEffect, useState } from 'react'
import './App.css'
import { Auth } from './components/auth'
import { db } from './config/firebase'
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

function App() {

  const [testList, setTestList] = useState([]);

  const [newTestName, setNewTestName] = useState("");
  const [newTestInfo, setNewTestInfo] = useState("");

  const [updateTestName, setUpdateTestName] = useState("");
  const [updateTestInfo, setUpdateTestInfo] = useState("");

  const testCollectionRef = collection(db, "test")

  const onSubmitTest = async () => {
    try {
      await addDoc(testCollectionRef, {
        test_naam: newTestName, 
        test_info: newTestInfo,
      });

      getTestList();
    } catch(err){
      console.error(err);
    }
  }

  const deleteTest = async (id) => {
    const testDoc = doc(db, "test", id);
    await deleteDoc(testDoc)
    getTestList();
  }
  
  const updateTest = async (id) => {
    const testDoc = doc(db, "test", id);
    await updateDoc(testDoc, {
      test_naam: updateTestName,
      test_info: updateTestInfo,
    })
    getTestList();
  }

  const getTestList = async () => {
    try{
      const data = await getDocs(testCollectionRef)
      const filteredData = data.docs.map((doc) => ({...doc.data(),
         id: doc.id}))
      setTestList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTestList();
  }, [])

  return (
      <div>
        <Auth />

        <div>
          <input type="text" placeholder='Test_naam...' onChange={(e) => setNewTestName(e.target.value)}/>
          <input type="text" placeholder='Test_info...' onChange={(e) => setNewTestInfo(e.target.value)}/>
          <button onClick={onSubmitTest}>Submit</button>
        </div>

        <div>
          {testList.map((test) => (
            <div>
              <h1>{test.id}</h1>
              <p>{test.test_naam}</p>
              <p>{test.test_info}</p>
              <input placeholder='New test name...' value={test.test_naam} onChange={(e) => setUpdateTestName(e.target.value)}/>
              <input placeholder='New test info...' value={test.test_info} onChange={(e) => setUpdateTestInfo(e.target.value)}/>
              <button onClick={() => updateTest(test.id)}>Update test</button>
              <button onClick={() => deleteTest(test.id)}>Delete test</button>
            </div>
          ))}
        </div>
      </div>
  );
}

export default App
