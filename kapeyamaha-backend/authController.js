const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // Generate verification token
    const verificationToken = user.getVerificationToken();
    await user.save();

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    
    const message = `
      <h2>Welcome to KAPEYAMAHA Enterprises!</h2>
      <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #ef4444;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin: 20px 0;
      ">Verify Email Address</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification - KAPEYAMAHA Enterprises',
        html: message
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification.'
      });
    } catch (error) {
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address first'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    user.loginHistory.push({
      date: Date.now(),
      ip: req.ip,
      device: req.headers['user-agent']
    });
    await user.save();

    // Create token
    const token = user.getSignedJwtToken();

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const verificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      verificationToken,
      verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Mark email as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    // Redirect to frontend or show success
    res.redirect(`${process.env.FRONTEND_URL}/email-verified`);

  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your KAPEYAMAHA account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #ef4444;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin: 20px 0;
      ">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset - KAPEYAMAHA Enterprises',
        html: message
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send confirmation email
    const message = `
      <h2>Password Updated Successfully</h2>
      <p>Your KAPEYAMAHA account password has been successfully updated.</p>
      <p>If you didn't make this change, please contact our support immediately.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Updated - KAPEYAMAHA Enterprises',
      html: message
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = req.body.newPassword;
    await user.save();

    // Send confirmation email
    const message = `
      <h2>Password Updated</h2>
      <p>Your password has been successfully updated.</p>
      <p>If you didn't make this change, please contact our support immediately.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Updated - KAPEYAMAHA Enterprises',
      html: message
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, client should remove token
    // Server-side: Add token to blacklist if needed
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};