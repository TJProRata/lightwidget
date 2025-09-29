import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Technology from './pages/Technology';
import Business from './pages/Business';
import Science from './pages/Science';
import AdminDashboard from './pages/admin/Dashboard';
import CustomerDetail from './pages/admin/CustomerDetail';
import NewCustomer from './pages/admin/NewCustomer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/business" element={<Business />} />
        <Route path="/science" element={<Science />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/customers/new" element={<NewCustomer />} />
        <Route path="/admin/customers/:id" element={<CustomerDetail />} />
      </Routes>
    </Router>
  );
}

export default App;