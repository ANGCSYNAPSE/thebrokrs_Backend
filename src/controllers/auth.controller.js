import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../services/email.service.js';
import { sendError, sendSuccess } from '../utils/response.js';

const generateResetToken = () => crypto.randomBytes(32).toString('hex');

// Helper for tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 'Invalid email format', 400);
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return sendError(res, 'Phone number must be 10 digits', 400);
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : [])
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return sendError(res, 'Email already registered', 400);
      }
      if (existingUser.phone === phone) {
        return sendError(res, 'Phone number already registered', 400);
      }
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        ...(phone && { phone }),
        password: hashedPassword,
        otp,
        otpExpiresAt,
        isVerified: false
      }
    });

    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp, name);

    return sendSuccess(res, 'User registered successfully. OTP sent to your email. Please verify to continue.', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        isVerified: false
      },
      emailSent: emailResult.success,
      nextStep: 'verify-otp'
    }, 201);

  } catch (error) {
    console.error('Register error:', error);
    return sendError(res, error.message || 'Registration failed', 500, error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Update last login and refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLogin: new Date(),
        refreshToken 
      }
    });

    return sendSuccess(res, 'Login successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      },
      accessToken,
      refreshToken,
    });

  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, error.message || 'Login failed', 500, error);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return sendError(res, 'Email and OTP are required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return sendError(res, 'Invalid OTP', 400);
    }

    if (new Date() > user.otpExpiresAt) {
      return sendError(res, 'OTP has expired', 400);
    }

    // Mark user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        phoneVerified: true,
        otp: null,
        otpExpiresAt: null
      }
    });

    // Send welcome email
    await sendWelcomeEmail(email, user.name);

    // Generate tokens after OTP verification
    const { accessToken, refreshToken } = generateTokens(updatedUser);

    // Update refresh token in database
    await prisma.user.update({
      where: { id: updatedUser.id },
      data: { refreshToken }
    });

    return sendSuccess(res, 'Email verified successfully. Account activated!', {
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isVerified: updatedUser.isVerified
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return sendError(res, error.message || 'OTP verification failed', 500, error);
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 'Email is required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (user.isVerified) {
      return sendError(res, 'User is already verified', 400);
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt }
    });

    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp, user.name);

    return sendSuccess(res, 'OTP resent to your email', {
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return sendError(res, error.message || 'Resend OTP failed', 500, error);
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 'Email is required', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 'Invalid email', 400);
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiresAt,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    const emailResult = await sendOTPEmail(email, otp, user.name);

    return sendSuccess(res, 'OTP sent', {
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error('Request password reset OTP error:', error);
    return sendError(res, error.message || 'Failed to request password reset OTP', 500, error);
  }
};

export const verifyPasswordResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return sendError(res, 'Email and OTP are required', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 'Invalid or expired OTP', 400);
    }

    if (user.otp !== otp) {
      return sendError(res, 'Invalid or expired OTP', 400);
    }

    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return sendError(res, 'Invalid or expired OTP', 400);
    }

    const resetToken = generateResetToken();
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiresAt: null,
        resetToken,
        resetTokenExpiresAt,
      },
    });

    return sendSuccess(res, 'OTP verified', {
      resetToken,
    });
  } catch (error) {
    console.error('Verify password reset OTP error:', error);
    return sendError(res, error.message || 'Failed to verify OTP', 500, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return sendError(res, 'Reset token and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters long', 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken,
      },
    });

    if (!user || !user.resetTokenExpiresAt || new Date() > user.resetTokenExpiresAt) {
      return sendError(res, 'Invalid or expired reset token', 400);
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    console.error('Reset password error:', error);
    return sendError(res, error.message || 'Failed to reset password', 500, error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 'Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters long', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'Incorrect current password', 400);
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    return sendSuccess(res, 'Password updated successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return sendError(res, error.message || 'Failed to change password', 500, error);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return sendError(res, 'Refresh token is required', 400);
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return sendError(res, 'Invalid or expired refresh token', 401);
    }

    // Find user with this refresh token
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        refreshToken: token
      }
    });

    if (!user) {
      return sendError(res, 'Invalid refresh token', 401);
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '15m' }
    );

    return sendSuccess(res, 'Token refreshed successfully', {
      accessToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return sendError(res, error.message || 'Token refresh failed', 401, error);
  }
};
