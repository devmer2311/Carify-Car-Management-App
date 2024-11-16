const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');

dotenv.config();

// Initialize the Express app
const app = express();

// Setup Swagger documentation
const setupSwagger = require('./swagger');
setupSwagger(app);  // Call this after initializing the app

app.use(express.json());
app.use(cors());

// Define routes
app.use('/api/user', userRoutes);
app.use('/api/car', carRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB: ', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
