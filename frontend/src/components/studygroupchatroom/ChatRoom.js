import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getUserId } from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/login/Login.js';


// Custom hook for managing socket connection
function useChatSocket(groupId, userId) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!groupId || !userId) return;

    // Initialize socket connection
    const newSocket = io('http://localhost:8001', { query: { userId } });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server');
      newSocket.emit('joinStudyGroup', groupId);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    // Cleanup on disconnection or when groupId/userId changes
    return () => {
      newSocket.emit('leaveStudyGroup', groupId);
      newSocket.disconnect();
    };
  }, [groupId, userId]);

  return socket;
}

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const paramName = useParams();
  const userId = getUserId(); // Fetch the current user's ID
  const groupId = paramName.groupId; // Group ID
  const socket = useChatSocket(groupId, userId);
  
  useEffect(() => {
    // Fetch messages from the database
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/api/messages/${groupId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    if (socket) {
      socket.on('previousMessages', (data) => {
        setMessages(data);
      });

      socket.on('newMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('previousMessages');
        socket.off('newMessage');
      }
    };
  }, [socket, groupId]);


  const handleSendMessage = async () => {
    if (newMessage !== "" && socket) {
      const messageData = {
        message: newMessage,
        userId: userId,
        studyGroup: groupId,
      };

      // Emit the message
      socket.emit("newMessage", messageData);

      // Add message to local state for immediate UI update
      setMessages((prevMessages) => [...prevMessages, messageData]);

      // Clear the input field
      setNewMessage("");
    }
  };

  console.log(messages)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Welcome to the Chat Room</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.user}: </strong> {/* Display the userId here */}
            {msg.message}
          </p>
        ))}
      </div>
      <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
};

export default ChatRoom;
