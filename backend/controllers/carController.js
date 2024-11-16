const Car = require('../models/Car');

const createCar = async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }

        const imageUrls = req.files.map(file => file.path);

        const car = new Car({
            title,
            description,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [], 
            images: imageUrls, 
            user: req.user.id, 
        });

        await car.save();
        res.status(201).json({ message: 'Car added successfully!', car });
    } catch (error) {
        console.error('Error creating car:', error.message);
        res.status(500).json({ message: 'Error creating car', error: error.message });
    }
};
const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ user: req.user.id });
        res.status(200).json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Error fetching cars', error: error.message });
    }
};
const getCarById = async (req, res) => {
    try {
        
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({ message: 'Error fetching car', error: error.message });
    }
};

const updateCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        
        if (!car || car.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Car not found or Unauthorized' });
        }

        const { title, description, tags } = req.body;
        let imageUrls = car.images || []; 

        
        if (req.files && req.files.length > 0) {
            
            req.files.forEach(file => {
                imageUrls.push(file.path); 
            });
        }

        
        car.title = title || car.title;
        car.description = description || car.description;
        car.tags = tags ? tags.split(',').map(tag => tag.trim()) : car.tags;

        
        car.images = imageUrls;

        
        await car.save();

        res.status(200).json({ message: 'Car updated successfully', car });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ message: 'Error updating car', error: error.message });
    }
};


const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car || car.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Car not found or Unauthorized' });
        }

        await Car.findByIdAndDelete(req.params.id); 
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Error deleting car', error: error.message });
    }
};

module.exports = { createCar, getCars, getCarById, updateCar, deleteCar };
