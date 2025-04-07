import React from 'react';
import './MessageList.css';

const MessageList = ({ messages, isTyping, messagesEndRef }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
        >
          <div className="message-content">
            <p>{message.text}</p>
            {message.timestamp && (
              <span className="message-time">{message.timestamp}</span>
            )}
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="message bot-message">
          <div className="message-content">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
