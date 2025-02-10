const express = require("express");
const authMiddleware = require("../Auth/auth");
const router = express.Router();
const { getAdminOwnData } = require("../Controllers/admin.controller");
const Admin = require("../Models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register admin (Public)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(409).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res
      .status(201)
      .json({ success: true, message: "Admin registered successfully" });
  } catch (err) {
    console.error("Error in /register route:", err); // Add this line
    res.status(500).json({ error: "Failed to register admin" });
  }
});

// Admin login (Public)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout (Public)
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Fetch admin data (Protected)
router.get("/fetch-single", authMiddleware(["ADMIN"]), getAdminOwnData);

module.exports = router;
