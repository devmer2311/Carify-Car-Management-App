import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; 


import carifyLogo from './logo.png';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            const response = await axios.post('https://carifyapp.onrender.com/api/user/login', formData);

            
            localStorage.setItem('token', response.data.token);

            
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials, please try again.');
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                
                <div className="auth-logo">
                    <img src={carifyLogo} alt="Carify Logo" />
                    <h1>Carify</h1>
                </div>
                <h2 className="auth-welcome">Hi, Welcome Back!</h2>
                <p className="auth-subtitle">Login to your account to enjoy</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="auth-button">Log In</button>
                </form>

                
                {error && <p className="auth-error">{error}</p>}

                <div className="auth-footer">
                    <span>Not registered yet?</span>
                    <button onClick={() => navigate('/signup')} className="auth-toggle-btn">Create an Account</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
