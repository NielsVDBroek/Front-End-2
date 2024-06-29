import { useEffect, useState, createContext  } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss'
import Register from './components/register/Register'
import Login from './components/login/Login';
import MainHeader from './components/mainHeader/MainHeader'
import Posts from './components/posts/Posts'
import Account from './components/account/Account';
import FinalizeAccount from './components/finalizeAccount/FinalizeAccount';
import ViewAccount from './components/viewAccount/ViewAccount';

function App() {
  const isNewUser = createContext(false);
  const newUsername = createContext(null);
  return (
    <>
      <MainHeader/>
      <main>
        <Routes>
          <Route path="/" element={<Posts/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/finalize-account" element={<FinalizeAccount />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/account" element={<Account/>}/>
          <Route path="/view-account/:userId" element={<ViewAccount />} />
        </Routes>
      </main>
    </>
  );
}

export default App
