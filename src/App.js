// App.jsx
import React, { Suspense } from 'react';
import Dashboard from './pages/Dashboard';
import './styles/Dashboard.css';

function App() {
  return (
    <Suspense fallback={<div className="loading">Loading dashboard...</div>}>
      <Dashboard />
    </Suspense>
  );
}

export default App;
