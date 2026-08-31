const bcrypt = require("bcryptjs");
const User = require("../models/User");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user data not available",
      });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user profile",
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user data not available",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, email, password, avatar } = req.body;

    // 1. Validate & update Name if provided
    if (name !== undefined) {
      const cleanName = typeof name === "string" ? name.trim() : "";
      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 2 characters long",
        });
      }
      if (cleanName.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Name cannot exceed 100 characters",
        });
      }
      user.name = cleanName;
    }

    // 2. Validate & update Email if provided
    if (email !== undefined) {
      const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      // Check if email changed and if another user already has this email
      if (cleanEmail !== user.email) {
        const emailExists = await User.findOne({
          email: cleanEmail,
          _id: { $ne: user._id },
        });

        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: "An account with this email already exists",
          });
        }

        user.email = cleanEmail;
      }
    }

    // 3. Validate & update Password if provided
    if (password !== undefined && password !== "") {
      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }

      const saltRounds = 12;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    // 4. Update Avatar if provided
    if (avatar !== undefined) {
      user.avatar = typeof avatar === "string" ? avatar.trim() : "";
    }

    // 5. Save updated user
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar || "",
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    // Duplicate key error (e.g. duplicate email)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error updating profile",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
