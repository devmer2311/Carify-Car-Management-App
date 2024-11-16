const express = require('express');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: User registration
 *     description: Registers a new user with the provided credentials.
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Invalid input or missing required fields.
 *       409:
 *         description: User already exists.
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and provides a token for further requests.
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful, returns an authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid credentials.
 *       400:
 *         description: Invalid input or missing required fields.
 */

module.exports = router;
