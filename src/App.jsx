import React from 'react';
import ChatBot from './components/ChatBot';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React Chatbot</h1>
      </header>
      <main>
        <ChatBot />
      </main>
      <footer className="app-footer">
        <p>Created for Lab 20</p>
      </footer>
    </div>
  );
}

export default App;
