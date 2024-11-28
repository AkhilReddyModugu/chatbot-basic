import React, { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';

function App() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
    setUserInput('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat', { prompt: userInput });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.response },
      ]);
    } catch (error) {
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'An error occurred. Please try again later.' },
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

      <div className="mt-4 w-100 w-md-50 d-flex flex-column gap-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded ${message.role === 'user' ? 'bg-info text-white' : 'bg-success text-white'}`}
          >
            {message.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
