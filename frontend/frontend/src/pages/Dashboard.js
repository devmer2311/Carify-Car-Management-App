import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import logo from './logo.png'; 

const Dashboard = () => {
    const [cars, setCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState('');
    const navigate = useNavigate();
    const carsPerPage = 3;

    const placeholderImage = 'https://imageplaceholder.net/150x100/eeeeee/131313?text=No-Image-Available';

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            
            navigate('/');
            return;
        }

        
        const fetchCars = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/car', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCars(response.data);
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentUser(response.data.name || 'User');
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchCars();
        fetchCurrentUser();
    }, [navigate]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCars = cars.filter((car) =>
        car.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentCars = filteredCars.slice(currentSlide, currentSlide + carsPerPage);

    const handleNextSlide = () => {
        if (currentSlide + carsPerPage < filteredCars.length) {
            setCurrentSlide(currentSlide + carsPerPage);
        }
    };

    const handlePrevSlide = () => {
        if (currentSlide - carsPerPage >= 0) {
            setCurrentSlide(currentSlide - carsPerPage);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="dashboard-logo">
                    <img src={logo} alt="Carify Logo" />
                    <h2>Carify</h2>
                </div>
                <input
                    type="text"
                    placeholder="Search Cars"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="dashboard-search"
                />
                <div className="profile-dropdown-container">
                    <button onClick={toggleDropdown} className="profile-button">
                        {currentUser} ▼
                    </button>
                    {dropdownOpen && (
                        <div className="profile-dropdown">
                            <p className="greeting-message">Hey Buddy!</p>
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            
            <div className="car-slider">
                <button
                    className="slider-button"
                    onClick={handlePrevSlide}
                    disabled={currentSlide === 0}
                >
                    ◀
                </button>

                
                <div className="car-card-group">
                    {currentCars.length === 0 ? (
                        <p>No cars found.</p>
                    ) : (
                        currentCars.map((car) => (
                            <div key={car._id} className="car-card">
                                <img
                                    src={
                                        car.images && car.images.length > 0
                                            ? car.images[0]
                                            : placeholderImage
                                    }
                                    alt={car.title}
                                    className="car-image"
                                    onError={(e) => (e.target.src = placeholderImage)}
                                />
                                <h3>{car.title}</h3>
                                <button
                                    onClick={() => navigate(`/cars/${car._id}`)}
                                    className="view-more-button"
                                >
                                    View More
                                </button>

                            </div>
                        ))
                    )}
                </div>

                <button
                    className="slider-button"
                    onClick={handleNextSlide}
                    disabled={currentSlide + carsPerPage >= filteredCars.length}
                >
                    ▶
                </button>
            </div>

    
            <button onClick={() => navigate('/addcar')} className="add-car-button">
                Add Car
            </button>
        </div>
    );
};

export default Dashboard;
