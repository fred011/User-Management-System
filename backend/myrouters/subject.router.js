const express = require("express");
const authMiddleware = require("../Auth/auth");
const {
  createSubject,
  getAllSubjects,
  updateSubjectWithId,
  deleteSubjectWithId,
} = require("../Controllers/subject.controller");

const router = express.Router();

router.post("/create", authMiddleware(["ADMIN", "TEACHER"]), createSubject); // Requires admin or teacher
router.get("/all", getAllSubjects); // Public or no specific role needed
router.patch(
  "/update/:id",
  authMiddleware(["ADMIN", "TEACHER"]),
  updateSubjectWithId
); // Requires admin or teacher
router.delete("/delete/:id", authMiddleware(["ADMIN"]), deleteSubjectWithId); // Requires admin

module.exports = router;
