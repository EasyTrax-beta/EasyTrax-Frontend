import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OidcCallbackPage from './pages/OidcCallbackPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/oidc-callback" element={<OidcCallbackPage />} />
      </Routes>
    </Router>
  )
}

export default App;
