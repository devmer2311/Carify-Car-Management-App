const express = require('express');
const { createCar, getCars, getCarById, updateCar, deleteCar } = require('../controllers/carController');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinaryConfig'); 


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cars', 
        allowedFormats: ['jpg', 'png', 'jpeg'], 
    },
});
const upload = multer({ storage });

const router = express.Router();

router.post('/', authenticate, upload.array('images', 10), createCar); 
router.get('/', authenticate, getCars);
router.get('/:id', getCarById);
router.put('/:id', authenticate, upload.array('images', 10), updateCar); 
router.delete('/:id', authenticate, deleteCar);


/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car
 *     description: Adds a new car to the database with images uploaded to Cloudinary.
 *     tags:
 *       - Cars
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - title
 *               - description
 *               - tags
 *               - images
 *     responses:
 *       201:
 *         description: Car created successfully.
 *       400:
 *         description: Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Get all cars
 *     description: Retrieves a list of all cars available in the database.
 *     tags:
 *       - Cars
 *     responses:
 *       200:
 *         description: A list of cars.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       401:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Get a car by ID
 *     description: Retrieves detailed information about a specific car by its ID.
 *     tags:
 *       - Cars
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the car to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found.
 *       401:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Update car details
 *     description: Updates the details of an existing car, including its images.
 *     tags:
 *       - Cars
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the car to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - title
 *               - description
 *               - tags
 *               - images
 *     responses:
 *       200:
 *         description: Car updated successfully.
 *       400:
 *         description: Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Car not found.
 */

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     description: Deletes a car from the database by its ID.
 *     tags:
 *       - Cars
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the car to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully.
 *       404:
 *         description: Car not found.
 *       401:
 *         description: Unauthorized access.
 */

module.exports = router;
