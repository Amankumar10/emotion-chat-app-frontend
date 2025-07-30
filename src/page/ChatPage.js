import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom';

const ChatPage = () => {
  const { threadId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/chat/messages/${threadId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [threadId, token]);

  useEffect(() => {
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${threadId}/`);
    socketRef.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => socket.close();
  }, [threadId]);

  const sendMessage = () => {
    if (text.trim() && socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          message: text,
          sender_id: userId,
        })
      );
      setText('');
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="mb-2 text-right text-sm text-gray-600">
        👤 Logged in as: <strong>{username}</strong>
      </div>

      <ChatRoom
        messages={messages}
        text={text}
        setText={setText}
        sendMessage={sendMessage}
        currentUser={username}
      />
    </div>
  );
};

export default ChatPage;
