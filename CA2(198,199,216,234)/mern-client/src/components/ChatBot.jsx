import React, { useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]); // storing messages
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // sending message and getting response
  const handleSendMessage = async () => {
    if (!inputMessage) return;

    const userMessage = { sender: 'user', message: inputMessage };
    setMessages([...messages, userMessage]); //adding user's message to the messages array

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5500/chat', { message: inputMessage });
      const botResponse = { sender: 'bot', message: res.data.response };
      setMessages([...messages, userMessage, botResponse]); //bot's response to the messages array
    } catch (error) {
      console.error('Error sending message:', error);
      const botErrorResponse = { sender: 'bot', message: 'Error occurred, please try again.' };
      setMessages([...messages, userMessage, botErrorResponse]); 
    } finally {
      setLoading(false);
    }

    setInputMessage(''); //clear input
  };

  return (
    <div>
      {/* open chat button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
        >
          Chat
        </button>
      )}

      {/* chat popup */}
      {isChatOpen && (
        <div
          className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg w-80 h-96 p-4 z-50 overflow-hidden transition-transform transform duration-300"
          style={{ zIndex: 9999 }}
        >
          {/* close button */}
          <button
            onClick={() => setIsChatOpen(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            X
          </button>

          <div className="chat-box flex flex-col h-full p-4 space-y-3">

            <div className="chat-messages mb-4 flex-1 overflow-y-auto space-y-4">
              
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message p-4 rounded-lg max-w-max ${msg.sender === 'user' ? 'user-message' : 'bot-message'} ${msg.sender === 'user' ? 'bg-gray-100 text-gray-800 self-end' : 'bg-blue-500 text-white self-start'}`}
                >
                  <strong>{msg.sender === 'user' ? 'User' : 'Bot'}:</strong> {msg.message}
                </div>
              ))}
            </div>

            
            <div className="chat-input flex items-center mt-4 space-x-2 -ml-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me something..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 ml-2"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
