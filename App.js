import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import SuperAdminDashboard from './SuperAdminDashboard';
import CompanyDashboard from './CompanyDashboard';
import CompaniesDashboard from './CompaniesDashboard';
import CreateUser from './CreateUser';
import CreateProfile from './CreateProfile';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/companies" element={<CompaniesDashboard />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-profile" element={<CreateProfile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
