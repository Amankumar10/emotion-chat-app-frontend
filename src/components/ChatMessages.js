import React from 'react';
const MessageBubble = ({ message, currentUser }) => {
  const isSentByMe = message.sender.username === currentUser;

  return (
    <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow
          ${isSentByMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
      >
        <p className="text-sm">{message.message || message.text}</p>
        <p className="text-xs text-right mt-1 opacity-70">
          {message.sender.username}
        </p>
      </div>
    </div>
  );
};

const ChatMessages = ({ messages, currentUser }) => {
  return (
    <div className="px-2">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} currentUser={currentUser} />
      ))}
    </div>
  );
};

export default ChatMessages;
