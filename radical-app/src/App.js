import React, { useState } from 'react';
import CourseResources from './components/courseResources';
import NavigationBar from './components/navigationBar';
import MainPage from './components/mainPage';
import Chatroom from './components/chatroom';
import Login from './components/login';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

function App() {

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chatroom/:roomName" element={<Chatroom />} />
        <Route path="/resources" element={<CourseResources />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;