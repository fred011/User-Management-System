require("dotenv").config();
const formidable = require("formidable"); // For handling form data, especially file uploads
const path = require("path"); // For working with file paths
const fs = require("fs"); // File system module
const bcrypt = require("bcryptjs"); // Corrected the typo here
const jwt = require("jsonwebtoken"); // For generating and verifying JSON Web Tokens

const School = require("../Models/school.model.js"); // School model

module.exports = {
  // School Registration Handler
  registerSchool: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err)
          return res
            .status(400)
            .json({ success: false, message: "Form Parsing Error" });

        const photo = files.image; // Expecting single image file
        if (!photo)
          return res
            .status(400)
            .json({ success: false, message: "Image is required" });

        const filepath = photo.filepath;
        const originalFilename = photo.originalFilename.replace(" ", "_");
        const newPath = path.join(
          __dirname,
          process.env.SCHOOL_IMAGE_PATH,
          originalFilename
        );

        const photoData = fs.readFileSync(filepath);
        fs.writeFileSync(newPath, photoData); // Save uploaded image to server

        // Encrypting Password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(fields.password, salt);

        // Creating new School instance
        const newSchool = new School({
          school_name: fields.school_name,
          email: fields.email,
          admin: fields.admin,
          password: hashPassword,
        });

        const savedSchool = await newSchool.save();
        res.status(200).json({
          success: true,
          data: savedSchool,
          message: "School is Registered Successfully.",
        });
      });
    } catch (error) {
      console.error("Error registering school:", error);
      res
        .status(500)
        .json({ success: false, message: "School registration failed." });
    }
  },

  // School Login Handler
  loginSchool: async (req, res) => {
    try {
      const school = await School.findOne({ email: req.body.email });
      if (!school) {
        return res
          .status(401)
          .json({ success: false, message: "Email is not registered." });
      }

      const isAuth = bcrypt.compareSync(req.body.password, school.password);
      if (!isAuth) {
        return res
          .status(401)
          .json({ success: false, message: "Password is Incorrect." });
      }

      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(
        {
          id: school._id,
          admin: school.admin,
          school_name: school.school_name,
          role: "SCHOOL",
        },
        jwtSecret,
        { expiresIn: "1h" } // Token valid for 1 hour
      );

      res.header("Authorization", token);
      res.status(200).json({
        success: true,
        message: "Successfully Logged In.",
        user: {
          id: school._id,
          admin: school.admin,
          school_name: school.school_name,
          role: "SCHOOL",
        },
      });
    } catch (error) {
      console.error("Error logging in school:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error [SCHOOL LOGIN].",
      });
    }
  },

  // Fetch All Schools
  getAllSchools: async (req, res) => {
    try {
      const schools = await School.find().select("-password"); // Exclude sensitive fields
      res.status(200).json({
        success: true,
        message: "Successfully fetched all schools",
        schools,
      });
    } catch (error) {
      console.error("Error fetching schools:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error [SCHOOL DATA].",
      });
    }
  },

  // Fetch Single School Data
  getSchoolOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const school = await School.findOne({ _id: id }).select("-password");
      if (!school) {
        return res.status(404).json({
          success: false,
          message: "School not found.",
        });
      }
      res.status(200).json({
        success: true,
        school,
      });
    } catch (error) {
      console.error("Error fetching single school data:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error [OWN SCHOOL DATA].",
      });
    }
  },

  // Update School Handler
  updateSchool: async (req, res) => {
    try {
      const id = req.user.id;

      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err)
          return res
            .status(400)
            .json({ success: false, message: "Form Parsing Error" });

        const school = await School.findOne(id);
        if (!school)
          return res
            .status(404)
            .json({ success: false, message: "School not found" });

        if (files.image) {
          const photo = files.image;
          const originalFilename = photo.originalFilename.replace(" ", "_");

          // Delete old image if it exists
          if (school.school_image) {
            const oldImagePath = path.join(
              __dirname,
              process.env.SCHOOL_IMAGE_PATH,
              school.school_image
            );
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
          }

          // Save new image
          const newPath = path.join(
            __dirname,
            process.env.SCHOOL_IMAGE_PATH,
            originalFilename
          );
          const photoData = fs.readFileSync(photo.filepath);
          fs.writeFileSync(newPath, photoData);

          school.school_image = originalFilename; // Update school image
        }

        // Update fields
        Object.keys(fields).forEach((key) => {
          school[key] = fields[key];
        });

        await school.save();
        res.status(200).json({
          success: true,
          message: "School updated Successfully.",
          school,
        });
      });
    } catch (error) {
      console.error("Error updating school:", error);
      res
        .status(500)
        .json({ success: false, message: "School update failed." });
    }
  },
};
