import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatMessages from '../components/ChatMessages';

const ChatPage = () => {
  const { threadId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  const userId = localStorage.getItem('user_id'); // save this on login
  const token = localStorage.getItem('token');

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/chat/messages/${threadId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await res.json();
      setMessages(data);
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
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded w-fit max-w-[75%] ${
              msg.sender === localStorage.getItem('username')
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-white text-gray-800'
            }`}
          >
            <div className="text-sm font-bold">{msg.sender?.username || 'You'}</div>
            <div>{msg.message || msg.text}</div>
            <div className="text-xs text-gray-300">{msg.timestamp}</div>
          </div>
        ))}
      </div>

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
