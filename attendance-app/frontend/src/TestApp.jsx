// Simple test to verify React is working
import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontSize: '24px' }}>
      <h1>✅ React is Working!</h1>
      <p>If you see this, React is rendering correctly.</p>
      <p style={{ color: 'red' }}>The issue is in the main App component.</p>
    </div>
  );
}

export default TestApp;

