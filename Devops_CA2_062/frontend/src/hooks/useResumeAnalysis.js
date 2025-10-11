// frontend/src/hooks/useResumeAnalysis.js - WITH PERSISTENCE

import { useState, useEffect } from 'react';
import { resumeAnalysisService } from '../services/api/resumeAnalysisApi';

const STORAGE_KEY = 'resumeAnalysisState';

export function useResumeAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Load saved state on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedState = JSON.parse(saved);
        
        // Only restore if it's recent (within 1 hour)
        const savedTime = new Date(savedState.timestamp);
        const now = new Date();
        const hoursSinceAnalysis = (now - savedTime) / (1000 * 60 * 60);
        
        if (hoursSinceAnalysis < 1 && savedState.analysis) {
          setAnalysis(savedState.analysis);
          setUploadStatus(savedState.uploadStatus || '✅ Analysis restored from previous session');
        } else {
          // Clear old data
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (err) {
      console.error('Error loading saved analysis:', err);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save state to localStorage whenever analysis changes
  useEffect(() => {
    if (analysis) {
      const stateToSave = {
        analysis,
        uploadStatus,
        timestamp: new Date().toISOString()
      };
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (err) {
        console.error('Error saving analysis state:', err);
      }
    }
  }, [analysis, uploadStatus]);

  // Test file upload
  const testUpload = async (resumeFile, jdFile) => {
    if (!resumeFile || !jdFile) {
      setError('Please select both resume and job description files');
      return false;
    }

    // Validate files
    const resumeErrors = resumeAnalysisService.validateFile(resumeFile);
    const jdErrors = resumeAnalysisService.validateFile(jdFile);
    
    if (resumeErrors.length > 0 || jdErrors.length > 0) {
      setError([...resumeErrors, ...jdErrors].join(', '));
      return false;
    }

    setLoading(true);
    setError(null);
    setUploadStatus('📤 Testing file upload...');

    try {
      const result = await resumeAnalysisService.testUpload(resumeFile, jdFile);
      
      if (result.success) {
        const successMessage = `✅ Upload successful! Resume: ${result.resumeName} (${resumeAnalysisService.formatFileSize(result.resumeSize)}), ` +
          `JD: ${result.jdName} (${resumeAnalysisService.formatFileSize(result.jdSize)})`;
        setUploadStatus(successMessage);
        return true;
      } else {
        setError('Upload test failed: ' + result.msg);
        setUploadStatus('❌ Upload test failed');
        return false;
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setUploadStatus('❌ Network error - make sure backend is running');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Analyze resume
  const analyzeResume = async (resumeFile, jdFile) => {
    if (!resumeFile || !jdFile) {
      setError('Please select both resume and job description files');
      return false;
    }

    // Validate files
    const resumeErrors = resumeAnalysisService.validateFile(resumeFile);
    const jdErrors = resumeAnalysisService.validateFile(jdFile);
    
    if (resumeErrors.length > 0 || jdErrors.length > 0) {
      setError([...resumeErrors, ...jdErrors].join(', '));
      return false;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setUploadStatus('🤖 AI is analyzing your resume... This may take 30-60 seconds');

    try {
      const result = await resumeAnalysisService.analyzeResume(resumeFile, jdFile);
      
      if (result.success) {
        setAnalysis(result.analysis);
        const successMessage = `✅ Analysis complete! Found ${result.analysis.missingSkillsCount} skills to consider and ${result.analysis.improvementTipsCount} suggestions.`;
        setUploadStatus(successMessage);
        return result.analysis;
      } else {
        setError('Analysis failed: ' + result.msg);
        setUploadStatus('❌ Analysis failed');
        if (result.hint) {
          setError(prev => (prev || '') + '. ' + result.hint);
        }
        return false;
      }
    } catch (err) {
      setError('Analysis error: ' + err.message);
      setUploadStatus('❌ Network error - make sure both backend and AI service are running');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear analysis results
  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
    setUploadStatus('');
    
    // Remove from localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing saved analysis:', err);
    }
  };

  // Clear all state
  const reset = () => {
    setAnalysis(null);
    setLoading(false);
    setError(null);
    setUploadStatus('');
    
    // Remove from localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing saved analysis:', err);
    }
  };

  return {
    // State
    analysis,
    loading,
    error,
    uploadStatus,
    
    // Actions
    testUpload,
    analyzeResume,
    clearAnalysis,
    reset,
    
    // Computed values
    hasAnalysis: !!analysis,
    isProcessing: loading
  };
}