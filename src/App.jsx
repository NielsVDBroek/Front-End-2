import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss'
import { Auth } from './components/auth/auth'
import { db } from './config/firebase'
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import MainHeader from './components/mainHeader/MainHeader'
import Posts from './components/posts/Posts'
import Account from './components/account/Account';

function App() {

  return (
    <>
      <MainHeader/>
      <main>
        <Routes>
          <Route path="/" element={<Posts/>}/>
          <Route path="/login" element={<Auth/>}/>
          <Route path="/account" element={<Account/>}/>
        </Routes>
      </main>
    </>
  );
}

export default App
