import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import botResponses from '../data/responses.json';
import './ChatBot.css';

const ChatBot = () => {
  // Initialize messages from localStorage or use default welcome message
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text, sender) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    addMessage(text, 'user');

    // Show bot is typing
    setIsTyping(true);

    // Find a response or use default
    setTimeout(() => {
      setIsTyping(false);

      // Look for a matching response in our JSON
      const userQuestion = text.toLowerCase().trim();
      const matchedResponse = botResponses.find(item =>
        userQuestion.includes(item.question.toLowerCase())
      );

      if (matchedResponse) {
        addMessage(matchedResponse.answer, 'bot');
      } else {
        addMessage("I'm not sure how to respond to that. Can you try asking something else?", 'bot');
      }
    }, 1000); // 1 second delay
  };

  const clearChat = () => {
    // Keep only the welcome message
    const welcomeMessage = {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <h2>React Chatbot</h2>
        <button className="clear-button" onClick={clearChat} aria-label="Clear chat history">
          Clear Chat
        </button>
      </div>
      <div className="chatbot-container">
        <MessageList
          messages={messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatBot;
