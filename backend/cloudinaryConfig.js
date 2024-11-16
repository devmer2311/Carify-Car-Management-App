const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
        api_key: API_KEY, 
        api_secret: API_SECRET,
});


module.exports = cloudinary;
