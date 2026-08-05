import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getAllUsers,
  updateKycStatus,
} from '../controllers/user.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 */
router.get('/profile', verifyToken, getUserProfile);

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', verifyToken, updateUserProfile);

/**
 * @swagger
 * /api/v1/users/kyc:
 *   put:
 *     summary: Update KYC status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               panNumber:
 *                 type: string
 *               panVerified:
 *                 type: boolean
 *               aadhaarVerified:
 *                 type: boolean
 *               videoKycCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: KYC updated successfully
 */
router.put('/kyc', verifyToken, updateKycStatus);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved
 */
router.get('/', getAllUsers);

export default router;
