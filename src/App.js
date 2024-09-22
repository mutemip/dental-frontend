import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AddAppointment from './components/AddAppointment';
import ViewAppointment from './components/ViewAppointment'; 
import UpdateAppointment from './components/UpdateAppointment'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-appointment" element={<AddAppointment />} />  
        <Route path="/appointments/:id" element={<ViewAppointment />} />
        <Route path="/update-appointment/:id" element={<UpdateAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;
