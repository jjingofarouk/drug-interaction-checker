import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DrugInteractionChecker from './components/DrugInteractionChecker';
import About from './components/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DrugInteractionChecker />} />
            <Route path="/checker" element={<DrugInteractionChecker />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;