import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import DrugInteractionChecker from './components/DrugInteractionChecker';
import Footer from './components/Footer';


function App() {
  return (
    <Router>
      <div className="app-container">
        
        <main>
        <Routes>
          <Route path="/" element={<DrugInteractionChecker />} />
          <Route path="/checker" element={<DrugInteractionChecker />} />
          {/* Placeholder routes */}
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/drugs" element={<div>Drug Database</div>} />
          <Route path="/interactions" element={<div>Interactions</div>} />
          <Route path="/resources" element={<div>Resources</div>} />
          <Route path="/contact" element={<div>Contact</div>} />
        </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;