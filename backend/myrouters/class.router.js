const express = require("express");
const authMiddleware = require("../Auth/auth");
const {
  createClass,
  getAllClasses,
  updateClassWithId,
  deleteClassWithId,
  getSingleClass,
  getAttendeeClass,
} = require("../Controllers/class.controller");

const router = express.Router();

router.post("/create", authMiddleware(["ADMIN"]), createClass); // Only admins can create classes
router.get("/all", authMiddleware(), getAllClasses); // Protected
router.get("/attendee", authMiddleware("TEACHER"), getAttendeeClass); // Protected
router.get("/single/:id", authMiddleware(), getSingleClass); // Protected
router.patch("/update/:id", authMiddleware(["ADMIN"]), updateClassWithId); // Only admins can update
router.delete("/delete/:id", authMiddleware(["ADMIN"]), deleteClassWithId); // Only admins can delete

module.exports = router;
