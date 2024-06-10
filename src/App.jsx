import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss'
import { Auth } from './components/auth/auth'
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
