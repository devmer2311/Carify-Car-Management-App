
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CarDetail from './pages/CarDetail';
import AddCar from './pages/AddCar';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cars/:id" element={<CarDetail />} />
                <Route path="/addcar" element={<AddCar />} />

                
            </Routes>
        </Router>
    );
}

export default App;
