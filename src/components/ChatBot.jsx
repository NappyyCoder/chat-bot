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

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Create user message object
    const userMessage = {
      id: messages.length + 1,
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages with the user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Save to localStorage immediately
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

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

      // Create bot message
      const botMessage = {
        id: updatedMessages.length + 1,
        text: matchedResponse
          ? matchedResponse.answer
          : "I'm not sure how to respond to that. Can you try asking something else?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Update messages with bot response
      const messagesWithBotResponse = [...updatedMessages, botMessage];
      setMessages(messagesWithBotResponse);

      // Save to localStorage
      localStorage.setItem('chatMessages', JSON.stringify(messagesWithBotResponse));
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
