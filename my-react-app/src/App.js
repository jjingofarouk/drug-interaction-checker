import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import DrugInteractionChecker from './components/DrugInteractionChecker';
import Navbars from './components/Navbar';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbars />
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;