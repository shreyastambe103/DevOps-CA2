// frontend/src/pages/candidate/ResumeOptimizer.jsx

import React, { useState } from 'react';
import { useResumeAnalysis } from '../../hooks/useResumeAnalysis';
import FileUpload from '../../components/candidate/ResumeAnalyzer/FileUpload';
import AnalysisResults from '../../components/candidate/ResumeAnalyzer/AnalysisResults';

export default function ResumeOptimizer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  
  const {
    analysis,
    loading,
    error,
    uploadStatus,
    testUpload,
    analyzeResume,
    clearAnalysis,
    reset,
    hasAnalysis,
    isProcessing
  } = useResumeAnalysis();

  const handleFilesSelected = (type, file) => {
    if (type === 'resume') {
      setResumeFile(file);
    } else if (type === 'jd') {
      setJdFile(file);
    }
  };

  const handleTestUpload = async () => {
    await testUpload(resumeFile, jdFile);
  };

  const handleAnalyzeResume = async () => {
    await analyzeResume(resumeFile, jdFile);
  };

  const handleClearAnalysis = () => {
    clearAnalysis();
  };

  const handleReset = () => {
    setResumeFile(null);
    setJdFile(null);
    reset();
  };

  const canUpload = resumeFile && jdFile && !isProcessing;

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <h2>Resume Optimizer</h2>
        <p style={{ color: '#6c757d', marginBottom: 0 }}>
          Upload your resume and a job description to get AI-powered optimization suggestions.
        </p>
      </div>

      {/* File Upload Section */}
      <FileUpload
        onFilesSelected={handleFilesSelected}
        resumeFile={resumeFile}
        jdFile={jdFile}
        disabled={isProcessing}
      />

      {/* Action Buttons */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 20, 
        display: 'flex', 
        gap: 15, 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleTestUpload}
          disabled={!canUpload}
          style={{
            padding: '12px 30px',
            backgroundColor: !canUpload ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            fontSize: 16,
            cursor: !canUpload ? 'not-allowed' : 'pointer',
            opacity: !canUpload ? 0.6 : 1
          }}
        >
          {loading && !hasAnalysis ? '⏳ Testing...' : 'Test Upload'}
        </button>
        
        <button
          onClick={handleAnalyzeResume}
          disabled={!canUpload}
          style={{
            padding: '12px 30px',
            backgroundColor: !canUpload ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            fontSize: 16,
            cursor: !canUpload ? 'not-allowed' : 'pointer',
            opacity: !canUpload ? 0.6 : 1
          }}
        >
          {loading && !uploadStatus.includes('Testing') ? '🤖 Analyzing...' : 'Analyze Resume'}
        </button>

        {(hasAnalysis || resumeFile || jdFile) && (
          <button
            onClick={handleReset}
            style={{
              padding: '12px 30px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            Start Over
          </button>
        )}
      </div>

      {/* Status Display */}
      {uploadStatus && (
        <div style={{ 
          padding: 15, 
          borderRadius: 8, 
          backgroundColor: uploadStatus.includes('✅') ? '#d4edda' : '#f8d7da',
          border: uploadStatus.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
          color: uploadStatus.includes('✅') ? '#155724' : '#721c24',
          marginBottom: 20
        }}>
          {uploadStatus}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: 15, 
          borderRadius: 8, 
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          marginBottom: 20
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Analysis Results */}
      {hasAnalysis && (
        <AnalysisResults 
          analysis={analysis} 
          onClear={handleClearAnalysis}
        />
      )}

      {/* Instructions */}
      {!hasAnalysis && (
        <div style={{ 
          marginTop: 30,
          padding: 20,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          border: '1px solid #e9ecef'
        }}>
          <h3>How to Use the Resume Optimizer</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <h4>Step 1: Upload Files</h4>
              <ul style={{ lineHeight: 1.6, fontSize: 14 }}>
                <li>Upload your current resume (PDF format)</li>
                <li>Upload the job description you're targeting (PDF format)</li>
                <li>Files must be under 10MB each</li>
              </ul>
            </div>
            <div>
              <h4>Step 2: Get Analysis</h4>
              <ul style={{ lineHeight: 1.6, fontSize: 14 }}>
                <li>Test upload to verify files are received correctly</li>
                <li>Run AI analysis to get optimization suggestions</li>
                <li>Review recommendations and apply relevant ones</li>
              </ul>
            </div>
          </div>
          
          <div style={{
            padding: 15,
            backgroundColor: '#e8f5e8',
            borderRadius: 8,
            border: '1px solid #4caf50',
            marginTop: 15
          }}>
            <strong>💡 Pro Tips:</strong>
            <ul style={{ marginTop: 10, marginBottom: 0, fontSize: 14 }}>
              <li>Use the most recent job description for best results</li>
              <li>Your resume should be your most current version</li>
              <li>Focus on suggestions that match your actual experience</li>
              <li>Use recommendations as inspiration, not copy-paste content</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}