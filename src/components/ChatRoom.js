import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatMessages from '../components/ChatMessages';

const ChatPage = () => {
  const { threadId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/chat/messages/${threadId}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();
  }, [threadId, token]);

  // Connect to WebSocket
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
      {/* Header */}
      <div className="mb-2 text-right text-sm text-gray-600">
        👤 Logged in as: <strong>{username}</strong>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        <ChatMessages messages={messages} currentUser={username} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
