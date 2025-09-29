import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Technology from './pages/Technology';
import Business from './pages/Business';
import Science from './pages/Science';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/business" element={<Business />} />
        <Route path="/science" element={<Science />} />
      </Routes>
    </Router>
  );
}

export default App;