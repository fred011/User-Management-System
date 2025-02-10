const bcrypt = require("bcryptjs"); // For hashing passwords securely
const validator = require("validator"); // For email validation
const Admin = require("../Models/admin.model"); // Import the Admin model

module.exports = {
  /**
   * Registers the admin (intended to be used only once for system setup).
   * Ensures that only one admin can be registered in the system.
   * @param {Object} req - The request object containing admin details in `body`.
   * @param {Object} res - The response object for sending success or error messages.
   */
  registerAdmin: async (req, res) => {
    try {
      // Destructure incoming data from the request body
      const { name, email, password } = req.body;

      // Ensure all required fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields (name, email, password) are required.",
        });
      }

      // Validate the email format
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format.",
        });
      }

      // Check if an admin already exists in the database
      const existingAdmin = await Admin.findOne();
      if (existingAdmin) {
        return res.status(403).json({
          success: false,
          message: "Admin is already registered.", // Prevent multiple admins from being created
        });
      }

      // Hash the password for secure storage (using async methods)
      const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
      const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

      // Create a new admin instance with the provided data
      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
      });

      // Save the new admin to the database
      const savedAdmin = await newAdmin.save();

      // Send a successful response with the saved admin data
      res.status(201).json({
        success: true,
        message: "Admin registered successfully.",
        data: savedAdmin,
      });
    } catch (error) {
      console.error("Error registering admin:", error.message); // Log the error message
      res.status(500).json({
        success: false,
        message: "Admin registration failed. Please try again later.",
      });
    }
  },

  /**
   * Logs in the admin by verifying email and password.
   * Generates a JWT token upon successful authentication.
   * @param {Object} req - The request object containing `email` and `password`.
   * @param {Object} res - The response object for sending success or error messages.
   */
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body; // Extract login credentials from the request
      const admin = await Admin.findOne(); // Fetch the only admin record

      // Check if the provided email matches the registered admin
      if (!admin || admin.email !== email) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or admin not found.",
        });
      }

      // Verify the provided password against the hashed password
      const isAuth = await bcrypt.compare(password, admin.password); // Using async bcrypt.compare
      if (!isAuth) {
        return res.status(401).json({
          success: false,
          message: "Invalid password.",
        });
      }

      // Generate a JWT token with a validity of 1 hour
      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: "ADMIN" },
        jwtSecret,
        {
          expiresIn: "1h",
        }
      );

      // Respond with the token and admin details
      res.header("Authorization", token);
      res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        admin: { name: admin.name, email: admin.email },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  /**
   * Retrieves the admin data, excluding the password.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object for sending admin data or errors.
   */
  getAdminData: async (req, res) => {
    try {
      const admin = await Admin.findOne().select("-password"); // Fetch admin data excluding the password
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin data not found.",
        });
      }
      res.status(200).json({ success: true, admin });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },
  getAdminOwnData: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id).select("-password");
      if (!admin) {
        return res.status(404).json({ error: "Admin data not found." });
      }
      res.status(200).json({ success: true, admin });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  },

  /**
   * Updates the admin data (admin-only functionality).
   * Allows updating fields like `name`, `email`, and `password`.
   * @param {Object} req - The request object containing updated data in `body`.
   * @param {Object} res - The response object for sending success or error messages.
   */
  updateAdminData: async (req, res) => {
    try {
      const admin = await Admin.findOne(); // Fetch the only admin record
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found.",
        });
      }

      // Destructure and update the provided fields
      const { name, email, password } = req.body;
      if (name) admin.name = name;
      if (email) admin.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10); // Generate a new salt
        admin.password = await bcrypt.hash(password, salt); // Hash the updated password
      }

      // Save the updated admin record
      const updatedAdmin = await admin.save();
      res.status(200).json({
        success: true,
        message: "Admin data updated successfully.",
        admin: updatedAdmin,
      });
    } catch (error) {
      console.error("Error updating admin data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update admin data.",
      });
    }
  },
};
