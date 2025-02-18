import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import ReportPothole from './components/ReportPothole';
import ViewReports from './components/ViewReports';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ReportPothole />} />
              <Route path="/view" element={<ViewReports />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App; 