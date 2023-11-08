import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import MainPage from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/mainpage/MainPage.js'; 
import Login from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/login/Login.js';
import Register from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/register/Register';
import CreateStudyGroup from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/studygroupformation/CreateStudyGroup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-study-group" element={<CreateStudyGroup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

