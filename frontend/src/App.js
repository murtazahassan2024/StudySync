import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Your existing components
import MainPage from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/mainpage/MainPage.js'; 
import Login from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/login/Login.js';
import Register from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/register/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
