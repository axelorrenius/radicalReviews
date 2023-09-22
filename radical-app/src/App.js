import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chatroom/:roomName" element={<Chatroom />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

function MainPage() {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleCreateOrJoin = () => {
    navigate(`/chatroom/${roomName}`);
  };

  return (
    <div>
      <h1>Chatroom App</h1>
      <input
        type="text"
        placeholder="Enter chatroom name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleCreateOrJoin}>
        Create or Join Chatroom
      </button>
    </div>
  );
}

function Chatroom() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    setMessages([...messages, inputMessage]);
    setInputMessage('');
  };

  return (
    <div>
      <h2>Chatroom</h2>
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