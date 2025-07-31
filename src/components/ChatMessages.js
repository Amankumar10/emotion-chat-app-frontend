import React from 'react';

const ChatMessages = ({ messages, currentUser }) => {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto flex-1 px-2">
      {messages.map((msg, index) => {
        const isSender = msg.sender?.username === currentUser || msg.sender === currentUser;

        return (
          <div
            key={index}
            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs break-words shadow-md ${
                isSender
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-black rounded-bl-none'
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {msg.sender?.username || (isSender ? 'You' : '')}
                {msg.emotion && (
                  <span className="ml-2 text-xs italic text-black">
                    ({msg.emotion})
                  </span>
                )}
              </div>
              <div className="text-base">{msg.message || msg.text}</div>
              <div className="text-xs mt-1 text-gray-300 text-right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
