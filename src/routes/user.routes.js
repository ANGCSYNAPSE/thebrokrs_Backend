import express from 'express';
import { verifyToken, verifyRole } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getAllUsers,
  updateKycStatus,
} from '../controllers/user.controller.js';
import {
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  changePassword,
} from '../controllers/auth.controller.js';

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
 * /api/v1/users/forgot-password/request-otp:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post('/forgot-password/request-otp', requestPasswordResetOtp);

/**
 * @swagger
 * /api/v1/users/forgot-password/verify-otp:
 *   post:
 *     summary: Verify password reset OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post('/forgot-password/verify-otp', verifyPasswordResetOtp);

/**
 * @swagger
 * /api/v1/users/forgot-password/reset:
 *   post:
 *     summary: Reset password with reset token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/forgot-password/reset', resetPassword);

/**
 * @swagger
 * /api/v1/users/change-password:
 *   post:
 *     summary: Change current password
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
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       401:
 *         description: Unauthorized
 */
router.post('/change-password', verifyToken, changePassword);

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
router.get('/', verifyToken, verifyRole(['admin']), getAllUsers);

export default router;
