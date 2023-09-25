import React from "react";
import { useNavigate } from 'react-router-dom';

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

export default MainPage;
  