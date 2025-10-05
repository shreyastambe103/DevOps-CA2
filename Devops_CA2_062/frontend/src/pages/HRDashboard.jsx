import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function HRDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const hrFeatures = [
    { id: 'overview', label: '📊 Overview', description: 'Recruitment pipeline and metrics' },
    { id: 'candidates', label: '👥 Candidates', description: 'Manage and screen candidates' },
    { id: 'jobs', label: '💼 Job Posts', description: 'Create and manage job listings' },
    { id: 'interviews', label: '🎤 Interviews', description: 'Schedule and manage interviews' },
    { id: 'analytics', label: '📈 Analytics', description: 'Recruitment insights and reports' }
  ];

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 30,
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: 15
      }}>
        <div>
          <h1>HR Dashboard</h1>
          <p>Manage your recruitment pipeline, <strong>{user?.name}</strong>! 💼</p>
        </div>
        <button onClick={logout} style={{ 
          padding: '10px 20px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        marginBottom: 30,
        borderBottom: '1px solid #ddd'
      }}>
        {hrFeatures.map(feature => (
          <button
            key={feature.id}
            onClick={() => setActiveTab(feature.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: activeTab === feature.id ? '#28a745' : 'transparent',
              color: activeTab === feature.id ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '5px 5px 0 0',
              marginRight: '5px'
            }}
          >
            {feature.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ minHeight: 400 }}>
        {activeTab === 'overview' && <HROverview />}
        {activeTab === 'candidates' && <CandidateManagement />}
        {activeTab === 'jobs' && <JobManagement />}
        {activeTab === 'interviews' && <InterviewManagement />}
        {activeTab === 'analytics' && <HRAnalytics />}
      </div>
    </div>
  );
}

// Sub-components for HR Dashboard
function HROverview() {
  return (
    <div>
      <h2>📊 Recruitment Pipeline Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f8f9fa' }}>
          <h3>Active Job Posts</h3>
          <p style={{ fontSize: 24, margin: 0, color: '#007bff' }}>8</p>
          <small>2 urgent positions</small>
        </div>
        <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f8f9fa' }}>
          <h3>Total Applications</h3>
          <p style={{ fontSize: 24, margin: 0, color: '#28a745' }}>247</p>
          <small>+23 this week</small>
        </div>
        <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f8f9fa' }}>
          <h3>Interviews Scheduled</h3>
          <p style={{ fontSize: 24, margin: 0, color: '#ffc107' }}>15</p>
          <small>5 today</small>
        </div>
        <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f8f9fa' }}>
          <h3>Offers Extended</h3>
          <p style={{ fontSize: 24, margin: 0, color: '#dc3545' }}>3</p>
          <small>Awaiting responses</small>
        </div>
      </div>
      
      <h3>Recent Activity</h3>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20 }}>
        <p>• New application for Senior Developer position</p>
        <p>• Interview completed for Marketing Manager role</p>
        <p>• Job post published: Frontend Developer</p>
      </div>
    </div>
  );
}

function CandidateManagement() {
  return (
    <div>
      <h2>👥 Candidate Management</h2>
      <div style={{ marginBottom: 20 }}>
        <input 
          type="text" 
          placeholder="Search candidates..."
          style={{ width: '70%', padding: '10px', marginRight: '10px' }}
        />
        <select style={{ padding: '10px' }}>
          <option>All Positions</option>
          <option>Senior Developer</option>
          <option>Marketing Manager</option>
        </select>
      </div>
      
      <div>
        <h3>Pending Reviews</h3>
        <p style={{ color: '#6c757d' }}>No candidates pending review. All caught up! 🎉</p>
        
        <button style={{ 
          padding: '12px 24px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: 5,
          marginTop: 10
        }}>
          Start AI-Powered Screening
        </button>
      </div>
    </div>
  );
}

function JobManagement() {
  return (
    <div>
      <h2>💼 Job Post Management</h2>
      <button style={{ 
        padding: '12px 24px', 
        backgroundColor: '#28a745', 
        color: 'white', 
        border: 'none', 
        borderRadius: 5,
        marginBottom: 20
      }}>
        + Create New Job Post
      </button>
      
      <div>
        <h3>Active Job Posts</h3>
        <p style={{ color: '#6c757d' }}>No active job posts. Create your first job posting!</p>
      </div>
    </div>
  );
}

function InterviewManagement() {
  return (
    <div>
      <h2>🎤 Interview Management</h2>
      <div style={{ marginBottom: 20 }}>
        <h3>Today's Interviews</h3>
        <p style={{ color: '#6c757d' }}>No interviews scheduled for today.</p>
      </div>
      
      <div>
        <h3>AI Interview Analysis</h3>
        <p>Review AI-generated insights from recent interviews</p>
        <button style={{ 
          padding: '10px 20px', 
          backgroundColor: '#17a2b8', 
          color: 'white', 
          border: 'none', 
          borderRadius: 5 
        }}>
          View Analysis Reports
        </button>
      </div>
    </div>
  );
}

function HRAnalytics() {
  return (
    <div>
      <h2>📈 Recruitment Analytics</h2>
      <div>
        <h3>Key Metrics</h3>
        <p>• Average time to hire: 18 days</p>
        <p>• Interview to offer ratio: 3:1</p>
        <p>• Top source of candidates: LinkedIn (45%)</p>
        
        <button style={{ 
          padding: '12px 24px', 
          backgroundColor: '#6f42c1', 
          color: 'white', 
          border: 'none', 
          borderRadius: 5,
          marginTop: 15
        }}>
          Generate Detailed Report
        </button>
      </div>
    </div>
  );
}