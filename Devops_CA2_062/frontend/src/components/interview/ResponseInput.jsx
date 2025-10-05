// frontend/src/components/interview/ResponseInput.jsx - FIXED
import { useState, useEffect } from 'react';

export default function ResponseInput({ 
  currentResponse, 
  onResponseChange, 
  onSubmit, 
  isLastQuestion,
  isLoading,
  questionIndex // ADD THIS PROP
}) {
  const [response, setResponse] = useState('');
  const [startTime] = useState(Date.now());

  // FIXED: Reset textarea when question changes
  useEffect(() => {
    setResponse(currentResponse || '');
  }, [currentResponse, questionIndex]); // ADD questionIndex dependency

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onSubmit(response, timeSpent);
    
    // CLEAR the textarea after submitting
    setResponse('');
  };

  return (
    <div>
      <div style={{ marginBottom: 15 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8,
          fontWeight: 'bold' 
        }}>
          Your Response:
        </label>
        
        <textarea
          value={response}
          onChange={(e) => {
            setResponse(e.target.value);
            onResponseChange(e.target.value);
          }}
          placeholder="Type your answer here... Take your time and be as detailed as possible."
          style={{
            width: '100%',
            minHeight: 150,
            padding: 12,
            border: '1px solid #ddd',
            borderRadius: 5,
            fontSize: 14,
            lineHeight: 1.5,
            resize: 'vertical'
          }}
        />
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center' 
      }}>
        <div style={{ fontSize: 14, color: '#666' }}>
          {response.length} characters
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading || !response.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: isLastQuestion ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: (!response.trim() || isLoading) ? 'not-allowed' : 'pointer',
            opacity: (!response.trim() || isLoading) ? 0.6 : 1,
            fontSize: 16
          }}
        >
          {isLastQuestion ? 'Complete Interview' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}