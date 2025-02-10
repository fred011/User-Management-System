const Teacher = require("../Models/teacher.model");
const bcrypt = require("bcryptjs");

// Fetch teachers with optional search filter
const getTeachersWithQuery = async (req, res) => {
  try {
    const filterQuery = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};

    const teachers = await Teacher.find(filterQuery);

    res.status(200).json({
      success: true,
      message: "Successfully fetched all teachers.",
      teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Fetch the logged-in teacher's data
const getTeacherOwnData = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password");
    if (!teacher) {
      return res.status(404).json({ error: "Teacher data not found." });
    }
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Update teacher data
const updateTeacherData = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found." });

    const updates = req.body;

    // Hash password if it's being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    Object.assign(teacher, updates);
    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Teacher data updated successfully.",
      teacher,
    });
  } catch (error) {
    console.error("Error updating teacher data:", error);
    res.status(500).json({ error: "Failed to update teacher data." });
  }
};

// Delete teacher by ID
const deleteTeacherWithId = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher)
      return res.status(404).json({ error: "Teacher not found." });

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully.",
      teacher: deletedTeacher,
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ error: "Failed to delete teacher." });
  }
};

// Fetch teacher by ID
const getTeacherWithId = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("-password");
    if (!teacher) return res.status(404).json({ error: "Teacher not found." });

    res.status(200).json({
      success: true,
      message: "Teacher fetched successfully.",
      teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ error: "Failed to fetch teacher." });
  }
};

module.exports = {
  getTeachersWithQuery,
  getTeacherOwnData,
  updateTeacherData,
  deleteTeacherWithId,
  getTeacherWithId,
};
