import React, { useState, useEffect } from 'react'; // Or Whatever React imports you want
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import db from './firebase-config';
import './App.css';

function App() {

  const [newChapterName, setNewChapterName] = useState('');
  const [chapterToDelete, setChapterToDelete] = useState('');
  const [chapterList, setChapterList] = useState([]);
  const [showDatabase, setShowDatabase] = useState([false]);

  const chaptersRef = collection(db, 'chapters_test');


  const displayDatabase = async () => {
    try {
      const chapterSnapshot = await getDocs(chaptersRef);
      const chapters = chapterSnapshot.docs.map(doc => doc.data());
      setChapterList(chapters);
      setShowDatabase(prevState => !prevState);
    } catch (error) {
      console.error('Error fetching data from the database:', error);
    }
  };

  // Function to add a chapter
  const addChapter = async () => {
    try {
      if (newChapterName.trim() !== '') {
        const newChapterRef = await addDoc(collection(db, 'chapters_test'), {name: newChapterName});
        setChapterList([...chapterList, {id: newChapterRef.id, name: newChapterName}]);
        setNewChapterName('');
      }
    } catch (error) {
      console.error('Error adding a chapter:', error);
    }
  };

  // Function to delete a chapter
  const deleteChapter = async () => {
    try {
      const idToDelete = chapterToDelete.trim();
      if (idToDelete !== '') {
        await deleteDoc(doc(db, 'chapters', idToDelete));
        const updatedChapters = chapterList.filter(chapter => chapter.id !== idToDelete);
        setChapterList(updatedChapters);
        setChapterToDelete('');
      }
    } catch (error) {
      console.error('Error deleting a chapter:', error);
    }
  };

  return (
    <div className="App">
      <h1>Chapter Operations</h1>
      <button onClick={displayDatabase}>Display Database</button>
      
      <div>
        <input
          type="text"
          placeholder="New Chapter Name"
          value={newChapterName}
          onChange={(e) => setNewChapterName(e.target.value)}
        />
        <button onClick={addChapter}>Add Chapter</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Chapter ID to Delete"
          value={chapterToDelete}
          onChange={(e) => setChapterToDelete(e.target.value)}
        />
        <button onClick={deleteChapter}>Delete Chapter</button>
      </div>

      {showDatabase && (
        <div>
          <h2>Chapter List</h2>
          <ul>
            {chapterList.map(chapter => (
              <li key={chapter.id}>{chapter.name}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default App;
