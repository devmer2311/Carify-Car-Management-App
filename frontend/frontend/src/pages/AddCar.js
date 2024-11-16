import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddCar.css';

const AddCar = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
    });
    const [images, setImages] = useState([]); 
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 10) {
            setMessage('You can only upload up to 10 images.');
            return;
        }
        setImages(files);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || images.length === 0) {
            setMessage('All fields are required, and at least one image is mandatory.');
            return;
        }

        const token = localStorage.getItem('token');
        const data = new FormData();


        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('tags', formData.tags);

    
        images.forEach((image) => {
            data.append('images', image); 
        });

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/car', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage('Car added successfully!');
            setTimeout(() => {
                navigate('/dashboard'); 
            }, 2000);
        } catch (error) {
            console.error('Error adding car:', error);
            setMessage(
                error.response?.data?.message || 'Failed to add car. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addcar-container">
            <div className="addcar-header">
                <button
                    className="back-button"
                    onClick={() => navigate('/dashboard')}
                >
                    ⬅ Back
                </button>
                <h2>Add a New Car</h2>
            </div>
            <form className="addcar-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tags">Tags (comma-separated):</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="images">Images (1-10):</label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    <div className="image-preview">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(img)}
                                alt={`Preview ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Add Car'}
                </button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default AddCar;
