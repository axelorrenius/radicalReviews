import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Link
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chatroom/:roomName" element={<Chatroom />} />
        <Route path="/resources" element={<CourseResources />} />
      </Routes>
    </Router>
  );
}

function CourseResources() {
  return (
    <div>
      <h2>Course Resources</h2>
      <p>Here you can find resources for the courses.</p>
    </div>
  );
}

function NavigationBar() {
  return (
    <nav>
      <Link to="/">Frontpage</Link>
      <Link to="/resources">Course resources</Link>
    </nav>
  );
}

function MainPage() {
  const chatroomOptions = ['DD2424', 'ME2004', 'DD2000']; // can fetch from API to get live chatrooms
  const navigate = useNavigate();

  const handleJoinChatroom = (room) => {
    navigate(`/chatroom/${room}`);
  };

  return (
    <div>
      <h1>Chatroom App</h1>
      {chatroomOptions.map(room => (
        <button key={room} onClick={() => handleJoinChatroom(room)}>
          Join {room}
        </button>
      ))}
    </div>
  );
}

function Chatroom() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const navigate = useNavigate();

  const handleSendMessage = () => {
    setMessages([...messages, inputMessage]);
    setInputMessage('');
  };

  return (
    <div>
      <h2>Chatroom</h2>
      <button onClick={() => navigate('..')}>Back to Main Menu</button>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default App;