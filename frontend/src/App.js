import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';


// Your existing components
import MainPage from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/mainpage/MainPage.js'; 
import Login from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/login/Login.js';
import Register from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/register/Register';
import CreateStudyGroup from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/studygroupformation/CreateStudyGroup';
import ChatRoom from './components/studygroupchatroom/ChatRoom.js';



function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-study-group" element={<CreateStudyGroup />} />
        <Route path="/chat-room/:groupId" element={<ChatRoom />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
