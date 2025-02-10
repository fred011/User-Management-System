const express = require("express");
const authMiddleware = require("../Auth/auth");
const router = express.Router();
const Student = require("../Models/student.model");
const bcrypt = require("bcryptjs");
const {
  getStudentsWithQuery,
  updateStudentData,
  getStudentOwnData,
  getStudentWithId,
  deleteStudentWithId,
  registerStudent,
  loginStudent,
} = require("../Controllers/student.controller");

// POST request to register a student
router.post("/register", registerStudent);

// POST request to login a student
router.post("/login", loginStudent);

router.get(
  "/fetch-with-query",
  authMiddleware(["ADMIN", "TEACHER"]),
  getStudentsWithQuery
); // Protected
router.get("/fetch-single", authMiddleware(["STUDENT"]), getStudentOwnData); // Only students can access their own data
router.get(
  "/fetch/:id",
  authMiddleware(["ADMIN", "TEACHER"]),
  getStudentWithId
); // Protected
router.patch(
  "/update/:id",
  authMiddleware(["ADMIN", "STUDENT"]),
  updateStudentData
); // Admins & students can update
router.delete("/delete/:id", authMiddleware(["ADMIN"]), deleteStudentWithId); // Only admins can delete

module.exports = router;
