const express = require("express");
const authMiddleware = require("../Auth/auth");
const {
  createSchedule,
  getScheduleWithClass,
  updateScheduleWithId,
  deleteScheduleWithId,
  fetchScheduleWithId,
} = require("../Controllers/schedule.controller");

const router = express.Router();

router.post("/create", authMiddleware(["ADMIN"]), createSchedule); // Requires admin or teacher
router.get(
  "/fetch-with-class/:id",
  authMiddleware(["ADMIN", "TEACHER", "STUDENT"]),
  getScheduleWithClass
); // Public or no specific role needed
router.get("/fetch/:id", fetchScheduleWithId); // Public or no specific role needed
router.post("/update/:id", authMiddleware(["ADMIN"]), updateScheduleWithId); // Requires admin or teacher
router.delete("/delete/:id", authMiddleware(["ADMIN"]), deleteScheduleWithId); // Requires admin

module.exports = router;
