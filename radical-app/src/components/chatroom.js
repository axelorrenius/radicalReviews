import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default Chatroom;