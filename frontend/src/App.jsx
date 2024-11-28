import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';

function App() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Reference to the bottom of the messages list

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(); // Automatically scroll when messages change
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add the user message to the messages array
    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
    setUserInput('');

    try {
      // Send the user input to the backend
      const response = await axios.post('http://127.0.0.1:8000/chat', { prompt: userInput });

      // Add the assistant's response (array of points) to the messages array
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.response },
      ]);
    } catch (error) {
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);

      // Add an error message to the messages array
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: ['An error occurred. Please try again later.'] },
      ]);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center min-vh-100 bg-light p-4">
      <h1>ChatBot</h1>
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column gap-3 w-100 w-md-50 bg-white p-4 rounded shadow-lg"
      >
        <div className="input-group">
          <input
            type="text"
            className="form-control p-2"
            placeholder="Enter your query"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center justify-content-center"
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </form>

      <div
        className="mt-4 w-100 w-md-50 d-flex flex-column gap-2"
        style={{ maxHeight: '65vh', overflowY: 'auto' }} // Enable scrolling for long chats
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              message.role === 'user' ? 'bg-info text-white' : 'bg-success text-white'
            }`}
          >
            {message.role === 'assistant' && Array.isArray(message.content) ? (
              // Render assistant responses as a list
              <ul>
                {message.content.map((point, pointIndex) => (
                  <li key={pointIndex}>{point}</li>
                ))}
              </ul>
            ) : (
              // Render user responses as plain text
              <p>{message.content}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Marker for auto-scroll */}
      </div>
    </div>
  );
}

export default App;
