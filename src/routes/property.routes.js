import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/property.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get('/', getAllProperties);

/**
 * @swagger
 * /api/v1/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property details
 */
router.get('/:id', getPropertyById);

/**
 * @swagger
 * /api/v1/properties:
 *   post:
 *     summary: Create new property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Property created
 */
router.post('/', verifyToken, createProperty);

/**
 * @swagger
 * /api/v1/properties/{id}:
 *   put:
 *     summary: Update property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property updated
 */
router.put('/:id', verifyToken, updateProperty);

/**
 * @swagger
 * /api/v1/properties/{id}:
 *   delete:
 *     summary: Delete property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted
 */
router.delete('/:id', verifyToken, deleteProperty);

export default router;
