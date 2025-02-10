const express = require("express");
const authMiddleware = require("../Auth/auth");
const {
  markAttendance,
  getAttendance,
  checkAttendance,
} = require("../Controllers/attendance.controller");

const router = express.Router();

router.post("/mark", authMiddleware(["TEACHER"]), markAttendance); // Only teachers can mark attendance
router.get("/:studentId", authMiddleware(), getAttendance); // Protected
router.get("/check/:classId", authMiddleware(), checkAttendance); // Protected

module.exports = router;
