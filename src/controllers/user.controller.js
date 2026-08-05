import prisma from '../config/database.js';
import { sendError, sendSuccess } from '../utils/response.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profileImage: true,
        bio: true,
        location: true,
        isVerified: true,
        isActive: true,
        lastLogin: true,
        notificationsEnabled: true,
        newsletterEnabled: true,
        phoneVerified: true,
        panVerified: true,
        panNumber: true,
        aadhaarVerified: true,
        videoKycCompleted: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, 'User profile retrieved successfully', user);
  } catch (error) {
    console.error('Get profile error:', error);
    return sendError(res, error.message || 'Failed to get user profile', 500, error);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, location, notificationsEnabled, newsletterEnabled, profileImage } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(location && { location }),
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
        ...(newsletterEnabled !== undefined && { newsletterEnabled }),
        ...(profileImage && { profileImage }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profileImage: true,
        bio: true,
        location: true,
        isVerified: true,
        notificationsEnabled: true,
        newsletterEnabled: true
      }
    });

    return sendSuccess(res, 'Profile updated successfully', user);
  } catch (error) {
    console.error('Update profile error:', error);
    return sendError(res, error.message || 'Failed to update profile', 500, error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profileImage: true,
        bio: true,
        location: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, 'User retrieved successfully', user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return sendError(res, error.message || 'Failed to get user', 500, error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    if (pageNum < 1 || limitNum < 1) {
      return sendError(res, 'Page and limit must be positive integers', 400);
    }

    const where = role ? { role } : {};

    const users = await prisma.user.findMany({
      where,
      skip,
      take: limitNum,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profileImage: true,
        bio: true,
        location: true,
        isVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where });

    return sendSuccess(res, 'Users retrieved successfully', {
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return sendError(res, error.message || 'Failed to get users', 500, error);
  }
};

export const updateKycStatus = async (req, res) => {
  try {
    const { panNumber, panVerified, aadhaarVerified, videoKycCompleted } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(panNumber && { panNumber }),
        ...(panVerified !== undefined && { panVerified }),
        ...(aadhaarVerified !== undefined && { aadhaarVerified }),
        ...(videoKycCompleted !== undefined && { videoKycCompleted }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        panVerified: true,
        panNumber: true,
        aadhaarVerified: true,
        videoKycCompleted: true
      }
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, 'KYC status updated successfully', user);
  } catch (error) {
    console.error('Update KYC error:', error);
    return sendError(res, error.message || 'Failed to update KYC status', 500, error);
  }
};
