const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../Models/student.model");

/**
 * Registers a Student.
 */
const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      student_class,
      age,
      gender,
      guardian,
      guardian_phone,
      password,
    } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      email: email,
      name: name,
      student_class: student_class,
      age: age,
      gender: gender,
      guardian: guardian,
      guardian_phone: guardian_phone,
      password: hashedPassword,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      data: savedStudent,
    });
  } catch (error) {
    console.error("Error registering student:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to register student." });
  }
};

/**
 * Logs in the Student.
 */
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Compare password with the stored hash
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not set" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, email: student.email, role: "STUDENT" },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is in your environment variables
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send successful response with token
    res.status(200).json({ message: "Login successful", student, token });
  } catch (err) {
    console.error("Error during login:", err); // Log the error
    res.status(500).json({ error: "Internal server error" });
  }
};
const getStudentsWithQuery = async (req, res) => {
  try {
    const filterQuery = {};
    if (req.query.hasOwnProperty("search")) {
      filterQuery["name"] = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.hasOwnProperty("student_class")) {
      console.log("Student class", req.query.student_class);
      filterQuery["student_class"] = req.query.student_class;
    }
    const students = await Student.find(filterQuery).populate("student_class");

    res.status(200).json({
      success: true,
      message: "Successfully fetched all students",
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error [STUDENT DATA].",
    });
  }
};
const getStudentOwnData = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .select("-password")
      .populate("student_class");
    if (!student) {
      return res.status(404).json({ error: "Student data not found." });
    }
    res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const updateStudentData = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findOne({ _id: id }); // Fetch the only admin record
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Destructure and update the provided fields
    const {
      name,
      email,
      password,
      student_class,
      age,
      gender,
      guardian,
      guardian_phone,
    } = req.body;
    if (name) student.name = name;
    if (email) student.email = email;
    if (student_class) student.student_class = student_class;
    if (age) student.age = age;
    if (gender) student.gender = gender;
    if (guardian) student.guardian = guardian;
    if (guardian_phone) student.guardian_phone = guardian_phone;
    if (password) {
      const salt = await bcrypt.genSalt(10); // Generate a new salt
      student.password = await bcrypt.hash(password, salt); // Hash the updated password
      student["password"] = student.password;
    }

    // Save the updated student record
    const updatedStudent = await student.save();
    res.status(200).json({
      success: true,
      message: "Student data updated successfully.",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update student data.",
    });
  }
};

const deleteStudentWithId = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
      student: deletedStudent,
    });
  } catch (error) {
    console.error("Error deleting student:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete student.",
    });
  }
};
const getStudentWithId = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).select("-password"); // Exclude sensitive fields

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student fetched successfully.",
      student,
    });
  } catch (error) {
    console.error("Error fetching student:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student.",
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getStudentsWithQuery,
  getStudentOwnData,
  updateStudentData,
  deleteStudentWithId,
  getStudentWithId,
};
