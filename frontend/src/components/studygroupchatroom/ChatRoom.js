import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUserID = 'currentUserObjectId'; // Replace with actual logged-in user's ID
  const currentStudyGroupID = 'currentStudyGroupObjectId'; // Replace with actual study group's ID

  useEffect(() => {
    // Establish socket connection
    const newSocket = io(process.env.mongoURI); // Replace with your server URL and port
    if (newSocket!==undefined ){
      console.log("server is working")


    }
    setSocket(newSocket);

    newSocket.on('previousMessages', (data) => {
      setMessages(data);
    });

    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (socket) {
      console.log("socker is present")
      socket.emit('newMessage', {
        message: newMessage,
        user: currentUserID, 
        studyGroup: currentStudyGroupID
      });
      setNewMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Welcome to the Chat Room</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.message}</p>
        ))}
      </div>
      <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
};

export default ChatRoom;
