import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CarDetail.css';
import { FaTrashAlt } from 'react-icons/fa'; 
import logo from './logo.png';

const CarDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [updatedCar, setUpdatedCar] = useState({
        title: '',
        description: '',
        tags: '',
        images: [],
    });
    const placeholderImage = 'https://imageplaceholder.net/300x200/eeeeee/131313?text=No-Image';

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await axios.get(`https://carifyapp.onrender.com/api/car/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const carData = response.data;

                setCar(carData); 
                setUpdatedCar({
                    title: carData.title,
                    description: carData.description,
                    tags: carData.tags ? carData.tags.join(', ') : '',
                    images: carData.images || [],
                });
            } catch (err) {
                console.error('Error fetching car details:', err);
                setError('Failed to fetch car details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [id, navigate]);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('title', updatedCar.title);
            formData.append('description', updatedCar.description);
            formData.append('tags', updatedCar.tags);

            updatedCar.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append('images', image);
                } else {
                    formData.append('images', image);
                }
            });

            await axios.put(`http://localhost:5000/api/car/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });

            setIsUpdatePopupOpen(false);
            window.location.reload();
        } catch (err) {
            console.error('Error updating car:', err.response ? err.response.data : err);
            alert('Failed to update car. ' + (err.response ? err.response.data.message : 'Unknown error.'));
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            setLoading(true);
            await axios.delete(`http://localhost:5000/api/car/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            console.error('Error deleting car:', err);
            setError('Failed to delete car.');
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % updatedCar.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? updatedCar.images.length - 1 : prev - 1
        );
    };

    if (loading) return <p>Loading car details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="car-detail-container">
            
            <header className="dashboard-header">
                <div className="dashboard-logo">
                    <img src={logo} alt="Carify Logo" />
                    <h2>Carify</h2>
                </div>
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    Back to Dashboard
                </button>
            </header>

            {/* Car Details */}
            <h1>{car.title}</h1>
            <div className="image-carousel">
                <button className="carousel-button left" onClick={prevImage}>
                    ◀
                </button>
                <div className="carousel-image-container">
                    <img
                        className="main-image"
                        src={updatedCar.images[currentImageIndex] || placeholderImage}
                        alt="Main View"
                        onError={(e) => (e.target.src = placeholderImage)}
                    />
                    <span className="image-counter">
                        {currentImageIndex + 1}/{updatedCar.images.length || 1}
                    </span>
                </div>
                <button className="carousel-button right" onClick={nextImage}>
                    ▶
                </button>
            </div>
            <p><strong>Description:</strong> {car.description}</p>
            <p><strong>Tags:</strong> {car.tags && car.tags.length > 0 ? car.tags.join(', ') : 'No tags available'}</p>

            
            <button onClick={() => setIsUpdatePopupOpen(true)} className="update-button">
                Update Car
            </button>
            <button onClick={() => setIsDeletePopupOpen(true)} className="delete-icon-button">
                <FaTrashAlt />
            </button>

            {/* Update Popup */}
            {isUpdatePopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-container glassmorphism">
                        <h2>Update Car</h2>
                        <label>Title</label>
                        <input
                            type="text"
                            value={updatedCar.title}
                            onChange={(e) =>
                                setUpdatedCar({ ...updatedCar, title: e.target.value })
                            }
                        />
                        <label>Description</label>
                        <textarea
                            value={updatedCar.description}
                            onChange={(e) =>
                                setUpdatedCar({ ...updatedCar, description: e.target.value })
                            }
                        />
                        <label>Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={updatedCar.tags}
                            onChange={(e) =>
                                setUpdatedCar({ ...updatedCar, tags: e.target.value })
                            }
                        />
                        <label>Images (Upload)</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                setUpdatedCar({
                                    ...updatedCar,
                                    images: [...updatedCar.images, ...e.target.files],
                                })
                            }
                        />
                        <div className="popup-buttons">
                            <button onClick={handleUpdate} className="save-button">
                                Save
                            </button>
                            <button onClick={() => setIsUpdatePopupOpen(false)} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Popup */}
            {isDeletePopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Are you sure you want to delete this car?</h2>
                        <div className="popup-buttons">
                            <button onClick={handleDelete} className="delete-confirm-button">
                                Yes, Delete
                            </button>
                            <button onClick={() => setIsDeletePopupOpen(false)} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarDetail;
