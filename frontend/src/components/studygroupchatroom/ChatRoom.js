import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [userNames, setUserNames] = useState({});
  const paramName = useParams();
  const userId = getUserId(); // Fetch the current user's ID
  const groupId = paramName.groupId; // Group ID
  const [groupName, setGroupName] = useState('');
  const socket = useChatSocket(groupId, userId);
  const navigate = useNavigate();

  //problem with all usernaems not displaying.
const fetchUserNames = async (messages) => {
  const uniqueUserIds = [...new Set(messages.map(msg => msg.user))];
  const names = {};
  for (const id of uniqueUserIds) {
    const response = await axios.get(`http://localhost:8001/api/users/${id}`);
    const fullName = response.data; // Assuming the response directly contains the name as a string
    const firstName = fullName.split(' ')[0]; // Split the name string and take the first part
    names[id] = firstName;
  }
  setUserNames(names);
};

  const fetchGroupName = async () => {
    const response = await axios.get(`http://localhost:8001/api/studygroup/studyGroupName/${groupId}`);
    setGroupName(response.data);
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8001/api/messages/${groupId}`);
      const messages = response.data;
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
      if (newMessage !== "" && socket) {
        const messageData = {
          message: newMessage,
          userId: userId,
          studyGroup: groupId,
        };

        // Emit the message
        socket.emit("newMessage", messageData);

        // Clear the input field
        setNewMessage("");
      }
  };

  const handleLeaveChat = () => {
    navigate('/');
  };

const getMessageStyle = (messageUserId) => {
  return {
    textAlign: messageUserId === userId ? 'right' : 'left',
    '.messageSquircle': {
      backgroundColor: messageUserId === userId ? '#ADD8E6' : '#FFB6C1', // Light blue for current user, light pink for others
    },
  };
};



  useEffect(() => {
    if (messages.length > 0) {
        fetchUserNames(messages);
    }
}, [messages]); // Depend on messages
  
  useEffect(() => {
    //fetchUserNames();
    fetchGroupName();
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="fixed-header"> &emsp; &emsp; {groupName ? `${groupName} Chat Room` : 'Welcome to the Chat Room'}</h1>
      <div className="main-content">
        {messages.map((msg, index) => (
          <div key={index} style={getMessageStyle(msg.user)}>
            <div className={`messageSquircle ${msg.user === userId ? 'right' : 'left'}`}>
              <strong>{userNames[msg.user] || 'Loading...'}</strong>: {msg.message}
            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed-container">
        <input
          className="inputText"
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          style={{ marginRight: '60px', height:'30px', width: '250px', borderRadius:'20px', borderColor: '#5850c0' }} 
        />
        <button onClick={handleSendMessage} className="blueButton">Send Message</button>
      </div>
      
      <button onClick={handleLeaveChat} className="fixed-leave-button redButton">Leave Chat</button>
    </div>
  );
};
export default ChatRoom;
