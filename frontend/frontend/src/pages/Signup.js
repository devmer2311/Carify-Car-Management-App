import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import logo from './logo.png'; 

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
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
        setErrorMessage(''); 

        try {
           
            const response = await axios.post('http://localhost:5000/api/user/signup', formData);

           
            if (response.status === 201) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            if (error.response) {
               
                setErrorMessage(error.response.data.message || 'Signup failed');
            } else {
                
                setErrorMessage('Signup failed');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <img src={logo} alt="Carify Logo" />
                    <h2>Carify</h2>
                </div>
                <h2 className="auth-welcome">Welcome to Carify!</h2>
                <p className="auth-subtitle">Create your account to get started.</p>

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
                            placeholder="Choose a username"
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
                            placeholder="Create a password"
                        />
                    </div>

                    <button type="submit" className="auth-button">Sign Up</button>
                </form>

               
                {errorMessage && <p className="auth-error">{errorMessage}</p>}

                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <button onClick={() => navigate('/')} className="auth-toggle-btn">Log In</button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
