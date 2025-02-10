const express = require("express");
const authMiddleware = require("../Auth/auth");
const {
  createNotice,
  getAllNotices,
  updateNoticeWithId,
  deleteNoticeWithId,
  getTeacherNotices,
  getStudentNotices,
} = require("../Controllers/notice.controller");

const router = express.Router();

router.post("/create", authMiddleware(["ADMIN"]), createNotice); // Requires admin
router.get("/all", getAllNotices); // Public or no specific role needed
router.get("/teacher-notice", authMiddleware(["TEACHER"]), getTeacherNotices);
router.get("/student-notice", authMiddleware(["STUDENT"]), getStudentNotices);
router.patch("/update/:id", authMiddleware(["ADMIN"]), updateNoticeWithId); // Requires admin
router.delete("/delete/:id", authMiddleware(["ADMIN"]), deleteNoticeWithId); // Requires admin

module.exports = router;
