import nodemailer from 'nodemailer';
import {
  otpEmailTemplate,
  welcomeEmailTemplate,
  passwordResetEmailTemplate,
  accountVerificationTemplate,
} from '../templates/emailTemplates.js';

// Create transporter
let transporter;

const initTransporter = () => {
  if (process.env.NODE_ENV === 'development') {
    // For development, use Gmail SMTP
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // For production, use your email service
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
};

// Initialize transporter on import
initTransporter();

/**
 * Generate OTP.
 * Testing mode (default ON): always returns '1234' so you can verify
 * without checking email. Set USE_TEST_OTP=false in env to switch to
 * real random 6-digit OTPs for production.
 */
export const generateOTP = () => {
  if (process.env.USE_TEST_OTP !== 'false') {
    return '1234';
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via email
 */
export const sendOTPEmail = async (email, otp, userName = 'User') => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured. OTP not sent.');
      console.log(`📧 OTP for ${email}: ${otp}`);
      return { success: false, message: 'Email not configured' };
    }

    const template = otpEmailTemplate(userName, otp, 10);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email, userName = 'User') => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured. Welcome email not sent.');
      return { success: false, message: 'Email not configured' };
    }

    const template = welcomeEmailTemplate(userName, email);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test email configuration
 */
export const testEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, resetLink, userName = 'User') => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured.');
      return { success: false, message: 'Email not configured' };
    }

    const template = passwordResetEmailTemplate(userName, resetLink, 24);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send account verification email
 */
export const sendAccountVerificationEmail = async (email, verificationLink, userName = 'User') => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not configured.');
      return { success: false, message: 'Email not configured' };
    }

    const template = accountVerificationTemplate(userName, verificationLink, 15);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Account verification email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending account verification email:', error.message);
    return { success: false, error: error.message };
  }
};
