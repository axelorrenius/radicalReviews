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

    const handleFetchData = () => {
      fetch('http://127.0.0.1:5000/api/data')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMessages([...messages, data.message])
      })
      .catch(error => {
        console.log(error);
      });
    }
  
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
        <button onClick={handleFetchData}>Fetch Data</button>
      </div>
    );
  }

export default Chatroom;