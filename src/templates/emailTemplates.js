/**
 * Email Templates for TheBrokrs
 * Professional HTML email templates with consistent branding
 */

// Brand Colors
const COLORS = {
  primary: '#208AEF',
  secondary: '#764ba2',
  dark: '#1a1a1a',
  light: '#f5f7fa',
  lightGray: '#f0f0f0',
  text: '#333333',
  textSecondary: '#666666',
  success: '#27ae60',
  warning: '#f39c12',
};

/**
 * OTP Verification Email Template
 */
export const otpEmailTemplate = (userName, otp, expiryMinutes = 10) => {
  return {
    subject: '🔐 Verify Your Email - TheBrokrs OTP',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; color: white; margin: 0; }
            .tagline { font-size: 14px; color: rgba(255,255,255,0.8); margin: 5px 0 0 0; }
            .content { padding: 40px 30px; background-color: #fafafa; }
            .greeting { color: ${COLORS.text}; font-size: 18px; margin: 0 0 15px 0; font-weight: 600; }
            .intro-text { color: ${COLORS.textSecondary}; font-size: 15px; line-height: 1.8; margin: 0 0 25px 0; }
            .otp-container { 
              background: white; 
              border: 3px solid ${COLORS.primary}; 
              border-radius: 12px; 
              padding: 30px; 
              text-align: center; 
              margin: 30px 0;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .otp-label { 
              font-size: 12px; 
              color: ${COLORS.textSecondary}; 
              text-transform: uppercase; 
              letter-spacing: 1px; 
              margin: 0; 
              font-weight: 600;
            }
            .otp-code { 
              font-size: 48px; 
              font-weight: bold; 
              color: ${COLORS.primary}; 
              letter-spacing: 8px; 
              margin: 15px 0 0 0; 
              font-family: 'Courier New', monospace;
              word-spacing: 10px;
            }
            .expiry-info { 
              color: ${COLORS.warning}; 
              font-size: 14px; 
              margin: 20px 0 0 0; 
              font-weight: 600;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }
            .warning-icon { font-size: 18px; }
            .instructions { 
              background-color: #f0f8ff; 
              border-left: 4px solid ${COLORS.primary}; 
              padding: 15px; 
              margin: 25px 0; 
              border-radius: 4px;
            }
            .instructions ul { 
              margin: 10px 0; 
              padding-left: 20px; 
              color: ${COLORS.textSecondary}; 
              font-size: 14px;
            }
            .instructions li { margin: 8px 0; }
            .security-note { 
              background-color: #fff3cd; 
              border: 1px solid #ffeaa7; 
              border-radius: 8px; 
              padding: 15px; 
              margin: 20px 0; 
              font-size: 13px; 
              color: #856404;
            }
            .security-icon { margin-right: 8px; }
            .footer { 
              background-color: ${COLORS.lightGray}; 
              padding: 25px; 
              text-align: center; 
              font-size: 12px; 
              color: ${COLORS.textSecondary};
              border-top: 1px solid #e0e0e0;
            }
            .footer-links { margin: 10px 0; }
            .footer-links a { color: ${COLORS.primary}; text-decoration: none; margin: 0 10px; }
            .divider { border-top: 1px solid #e0e0e0; margin: 15px 0; }
            .contact-support { color: ${COLORS.primary}; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1 class="logo">TheBrokrs</h1>
              <p class="tagline">Your Trusted Real Estate Partner</p>
            </div>

            <!-- Content -->
            <div class="content">
              <h2 class="greeting">Hello ${userName},</h2>
              
              <p class="intro-text">
                Welcome to TheBrokrs! To complete your email verification, please use the one-time password (OTP) below.
              </p>

              <!-- OTP Box -->
              <div class="otp-container">
                <p class="otp-label">Your Verification Code</p>
                <p class="otp-code">${otp}</p>
                <div class="expiry-info">
                  <span class="warning-icon">⏱️</span>
                  <span>Valid for ${expiryMinutes} minutes</span>
                </div>
              </div>

              <!-- Instructions -->
              <div class="instructions">
                <strong style="color: ${COLORS.primary};">How to use your OTP:</strong>
                <ul>
                  <li>Copy the code above</li>
                  <li>Enter it in the verification field in the app</li>
                  <li>Your account will be immediately activated</li>
                </ul>
              </div>

              <!-- Security Note -->
              <div class="security-note">
                <span class="security-icon">🔒</span>
                <strong>Security Tip:</strong> Never share this OTP with anyone. TheBrokrs staff will never ask for your OTP.
              </div>

              <p style="color: ${COLORS.textSecondary}; font-size: 14px; margin: 20px 0;">
                If you didn't request this verification code, or if you need help, please <a href="mailto:support@thebrokrs.com" class="contact-support">contact our support team</a>.
              </p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 0;">© 2026 TheBrokrs. All rights reserved.</p>
              <div class="footer-links">
                <a href="https://thebrokrs.com">Website</a>
                <a href="https://thebrokrs.com/help">Help</a>
                <a href="https://thebrokrs.com/privacy">Privacy</a>
              </div>
              <div class="divider"></div>
              <p style="margin: 0; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Your TheBrokrs Email Verification Code

Hello ${userName},

Your verification code is: ${otp}

This code is valid for ${expiryMinutes} minutes.

Please do not share this code with anyone. TheBrokrs staff will never ask for your OTP.

If you need help, contact support@thebrokrs.com

© 2026 TheBrokrs. All rights reserved.
    `
  };
};

/**
 * Welcome Email Template
 */
export const welcomeEmailTemplate = (userName, email) => {
  return {
    subject: '🎉 Welcome to TheBrokrs - Your Account is Ready!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; color: white; margin: 0; }
            .tagline { font-size: 14px; color: rgba(255,255,255,0.8); margin: 5px 0 0 0; }
            .content { padding: 40px 30px; background-color: #fafafa; }
            .greeting { color: ${COLORS.text}; font-size: 20px; margin: 0 0 15px 0; font-weight: 600; }
            .intro-text { color: ${COLORS.textSecondary}; font-size: 15px; line-height: 1.8; margin: 0 0 25px 0; }
            .features-section { margin: 30px 0; }
            .features-title { 
              font-size: 16px; 
              font-weight: 600; 
              color: ${COLORS.text}; 
              margin: 0 0 15px 0;
            }
            .feature-card { 
              background: white; 
              border-left: 4px solid ${COLORS.primary}; 
              padding: 15px; 
              margin: 12px 0; 
              border-radius: 6px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .feature-icon { font-size: 18px; margin-right: 10px; }
            .feature-text { color: ${COLORS.textSecondary}; font-size: 14px; margin: 0; }
            .cta-button { 
              display: inline-block; 
              background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); 
              color: white; 
              padding: 14px 32px; 
              border-radius: 8px; 
              text-decoration: none; 
              font-weight: 600; 
              text-align: center;
              margin: 25px 0;
              transition: transform 0.2s;
            }
            .cta-container { text-align: center; }
            .next-steps { 
              background-color: #e8f5e9; 
              border-left: 4px solid ${COLORS.success}; 
              padding: 15px; 
              margin: 20px 0; 
              border-radius: 4px;
            }
            .next-steps-title { 
              color: ${COLORS.success}; 
              font-weight: 600; 
              margin: 0 0 10px 0;
            }
            .next-steps ul { 
              margin: 10px 0; 
              padding-left: 20px; 
              color: ${COLORS.textSecondary}; 
              font-size: 14px;
            }
            .next-steps li { margin: 8px 0; }
            .footer { 
              background-color: ${COLORS.lightGray}; 
              padding: 25px; 
              text-align: center; 
              font-size: 12px; 
              color: ${COLORS.textSecondary};
              border-top: 1px solid #e0e0e0;
            }
            .footer-links { margin: 10px 0; }
            .footer-links a { color: ${COLORS.primary}; text-decoration: none; margin: 0 10px; }
            .divider { border-top: 1px solid #e0e0e0; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1 class="logo">TheBrokrs</h1>
              <p class="tagline">Your Trusted Real Estate Partner</p>
            </div>

            <!-- Content -->
            <div class="content">
              <h2 class="greeting">🎉 Welcome, ${userName}!</h2>
              
              <p class="intro-text">
                Your account is now fully activated and ready to use. Thank you for joining the TheBrokrs community - India's most trusted real estate platform.
              </p>

              <!-- Features -->
              <div class="features-section">
                <h3 class="features-title">What You Can Do Now:</h3>
                
                <div class="feature-card">
                  <span class="feature-icon">🏠</span>
                  <p class="feature-text"><strong>Browse Properties</strong> - Explore thousands of properties across major Indian cities</p>
                </div>

                <div class="feature-card">
                  <span class="feature-icon">👥</span>
                  <p class="feature-text"><strong>Connect with Agents</strong> - Get expert advice from certified real estate professionals</p>
                </div>

                <div class="feature-card">
                  <span class="feature-icon">❤️</span>
                  <p class="feature-text"><strong>Save Favorites</strong> - Keep track of properties you love and get instant notifications</p>
                </div>

                <div class="feature-card">
                  <span class="feature-icon">📊</span>
                  <p class="feature-text"><strong>Get Insights</strong> - Analyze market trends and make informed real estate decisions</p>
                </div>

                <div class="feature-card">
                  <span class="feature-icon">⚡</span>
                  <p class="feature-text"><strong>Fast Transactions</strong> - Complete your real estate deals quickly and securely</p>
                </div>
              </div>

              <!-- CTA Button -->
              <div class="cta-container">
                <a href="https://thebrokrs.com/app" class="cta-button">Start Exploring Now</a>
              </div>

              <!-- Next Steps -->
              <div class="next-steps">
                <h4 class="next-steps-title">✓ Recommended Next Steps:</h4>
                <ul>
                  <li><strong>Complete Your Profile</strong> - Add a profile photo and bio to build trust</li>
                  <li><strong>Set Preferences</strong> - Choose your preferred locations and property types</li>
                  <li><strong>Enable Notifications</strong> - Get alerts for new listings matching your criteria</li>
                  <li><strong>Verify Identity</strong> - Complete KYC to unlock premium features</li>
                </ul>
              </div>

              <p style="color: ${COLORS.textSecondary}; font-size: 14px; margin: 20px 0;">
                If you have any questions or need assistance, our support team is here to help at <strong>support@thebrokrs.com</strong>
              </p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 0;"><strong>Account Email:</strong> ${email}</p>
              <div class="divider"></div>
              <p style="margin: 0;">© 2026 TheBrokrs. All rights reserved.</p>
              <div class="footer-links">
                <a href="https://thebrokrs.com">Website</a>
                <a href="https://thebrokrs.com/help">Help</a>
                <a href="https://thebrokrs.com/privacy">Privacy</a>
                <a href="https://thebrokrs.com/terms">Terms</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to TheBrokrs!

Hello ${userName},

Your account is now fully activated and ready to use. Thank you for joining the TheBrokrs community.

What You Can Do Now:
• Browse Properties - Explore thousands of properties across major Indian cities
• Connect with Agents - Get expert advice from certified real estate professionals
• Save Favorites - Keep track of properties you love
• Get Insights - Analyze market trends
• Fast Transactions - Complete deals quickly and securely

Recommended Next Steps:
1. Complete Your Profile
2. Set Your Preferences
3. Enable Notifications
4. Verify Your Identity

If you need help, contact support@thebrokrs.com

Account Email: ${email}

© 2026 TheBrokrs. All rights reserved.
    `
  };
};

/**
 * Password Reset Email Template
 */
export const passwordResetEmailTemplate = (userName, resetLink, expiryHours = 24) => {
  return {
    subject: '🔐 Reset Your TheBrokrs Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; color: white; margin: 0; }
            .content { padding: 40px 30px; background-color: #fafafa; }
            .greeting { color: ${COLORS.text}; font-size: 18px; margin: 0 0 15px 0; font-weight: 600; }
            .intro-text { color: ${COLORS.textSecondary}; font-size: 15px; line-height: 1.8; margin: 0 0 25px 0; }
            .button-container { text-align: center; margin: 30px 0; }
            .reset-button { 
              display: inline-block; 
              background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); 
              color: white; 
              padding: 14px 40px; 
              border-radius: 8px; 
              text-decoration: none; 
              font-weight: 600;
            }
            .warning-box { 
              background-color: #fff3cd; 
              border: 1px solid #ffeaa7; 
              border-radius: 8px; 
              padding: 15px; 
              margin: 20px 0; 
              font-size: 13px; 
              color: #856404;
            }
            .footer { 
              background-color: ${COLORS.lightGray}; 
              padding: 25px; 
              text-align: center; 
              font-size: 12px; 
              color: ${COLORS.textSecondary};
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">TheBrokrs</h1>
            </div>

            <div class="content">
              <h2 class="greeting">Password Reset Request</h2>
              
              <p class="intro-text">
                Hi ${userName},
              </p>

              <p class="intro-text">
                We received a request to reset your TheBrokrs password. Click the button below to create a new password.
              </p>

              <div class="button-container">
                <a href="${resetLink}" class="reset-button">Reset Your Password</a>
              </div>

              <p style="color: ${COLORS.textSecondary}; font-size: 14px; text-align: center;">
                This link will expire in ${expiryHours} hours
              </p>

              <div class="warning-box">
                <strong>⚠️ Security Note:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
              </div>

              <p style="color: ${COLORS.textSecondary}; font-size: 14px;">
                Or copy and paste this link in your browser: <br>
                <code style="background: #f0f0f0; padding: 5px; border-radius: 4px;">${resetLink}</code>
              </p>
            </div>

            <div class="footer">
              <p>© 2026 TheBrokrs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Password Reset Request

Hi ${userName},

We received a request to reset your TheBrokrs password. 

Click the link below to create a new password:
${resetLink}

This link will expire in ${expiryHours} hours.

If you didn't request this password reset, please ignore this email.

© 2026 TheBrokrs. All rights reserved.
    `
  };
};

/**
 * Account Verification Email (for new device/location)
 */
export const accountVerificationTemplate = (userName, verificationLink, expiryMinutes = 15) => {
  return {
    subject: '🔐 Verify Your Account Access',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; color: white; margin: 0; }
            .content { padding: 40px 30px; background-color: #fafafa; }
            .button-container { text-align: center; margin: 30px 0; }
            .verify-button { 
              display: inline-block; 
              background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); 
              color: white; 
              padding: 14px 40px; 
              border-radius: 8px; 
              text-decoration: none; 
              font-weight: 600;
            }
            .footer { 
              background-color: ${COLORS.lightGray}; 
              padding: 25px; 
              text-align: center; 
              font-size: 12px; 
              color: ${COLORS.textSecondary};
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">TheBrokrs</h1>
            </div>

            <div class="content">
              <h2 style="color: ${COLORS.text}; margin-top: 0;">Verify Your Account Access</h2>
              
              <p style="color: ${COLORS.textSecondary}; font-size: 15px;">
                We detected an attempt to access your account from a new device or location. For your security, please verify this access.
              </p>

              <div class="button-container">
                <a href="${verificationLink}" class="verify-button">Verify Access</a>
              </div>

              <p style="color: ${COLORS.textSecondary}; font-size: 14px; text-align: center;">
                Link expires in ${expiryMinutes} minutes
              </p>

              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px; color: #856404;">
                <strong>⚠️ Unusual Activity:</strong> If you didn't attempt to access your account, please change your password immediately and contact our support team.
              </div>
            </div>

            <div class="footer">
              <p>© 2026 TheBrokrs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Verify Your Account Access

We detected an attempt to access your account from a new device or location.

Verify this access: ${verificationLink}

Link expires in ${expiryMinutes} minutes.

© 2026 TheBrokrs. All rights reserved.
    `
  };
};

export default {
  otpEmailTemplate,
  welcomeEmailTemplate,
  passwordResetEmailTemplate,
  accountVerificationTemplate,
};
