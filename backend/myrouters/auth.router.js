const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const authMiddleware = require("../Auth/auth");
const Admin = require("../Models/admin.model");
const Teacher = require("../Models/teacher.model");
const Student = require("../Models/student.model");

const router = express.Router();

// Nodemailer setup

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to find user by email & role
const findUserByRole = async (email, role) => {
  switch (role) {
    case "ADMIN":
      return await Admin.findOne({ email });
    case "TEACHER":
      return await Teacher.findOne({ email });
    case "STUDENT":
      return await Student.findOne({ email });
    default:
      return null;
  }
};
const findUserByEmail = async (email) => {
  // You may want to check for different user roles here
  const admin = await Admin.findOne({ email });
  if (admin) return admin;

  const teacher = await Teacher.findOne({ email });
  if (teacher) return teacher;

  const student = await Student.findOne({ email });
  if (student) return student;

  return null; // Return null if no user is found for that email
};

// Request Password Reset
router.post("/request-reset-password", async (req, res) => {
  console.log("reset called");
  console.log(req.body);
  try {
    const { email, role } = req.body;
    const user = await findUserByRole(email, role.toUpperCase());
    console.log("Called again");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    console.log("user found");

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
    await user.save();
    console.log("Token");

    // Send email with reset link
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetURL}">${resetURL}</a>
             <p>The link expires in 1 hour.</p>`,
    });

    res.json({ success: true, message: "Reset link sent to email." });
  } catch (error) {
    console.error("Error in password reset:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log incoming request body

    const { email, token, newPassword } = req.body; // Removed `role` for simplicity
    const user = await findUserByEmail(email); // Assume a function to find by email

    if (!user || !user.resetPasswordToken) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error); // Log the error
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.post(
  "/change-password",
  authMiddleware(["ADMIN", "TEACHER", "STUDENT"]),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      console.log("Request Body:", req.body); // Log request body for debugging

      let user;

      if (req.user.role === "ADMIN") {
        user = await Admin.findById(req.user.id);
      } else if (req.user.role === "TEACHER") {
        user = await Teacher.findById(req.user.id);
      } else if (req.user.role === "STUDENT") {
        user = await Student.findById(req.user.id);
      }

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      console.log("User found:", user);
      console.log("User password:", user.password);

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required.",
        });
      }

      // Log bcrypt compare result
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      console.log("bcrypt compare result:", isMatch); // Log the result of the comparison

      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect current password." });
      }

      // Hash the new password and save it
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ success: true, message: "Password changed successfully." });
    } catch (error) {
      console.error("Error changing password:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// Verify Token Route
router.post("/verify-token", (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, valid: true, user: decoded });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, valid: false, message: "Invalid token." });
  }
});

module.exports = router;
