import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbars from './components/Navbar';
import Footer from './components/Footer';
import DrugInteractionChecker from './components/DrugInteractionChecker';
import './App.css'; // Import the CSS file

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbars />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DrugInteractionChecker />} />
            <Route path="/checker" element={<DrugInteractionChecker />} />
            <Route path="/about" element={<div>About Page</div>} />
            <Route path="/drugs" element={<div>Drug Database</div>} />
            <Route path="/interactions" element={<div>Interactions</div>} />
            <Route path="/resources" element={<div>Resources</div>} />
            <Route path="/faq" element={<div>FAQ Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/donate" element={<div>Donate Page</div>} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;