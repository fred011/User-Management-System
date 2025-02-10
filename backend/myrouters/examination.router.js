const express = require("express");
const authMiddleware = require("../Auth/auth");
const {
  newExamination,
  getAllExaminations,
  getExaminationsByClass,
  updateExaminationWithId,
  deleteExaminationWithId,
} = require("../Controllers/examination.controller");

const router = express.Router();

router.post("/create", authMiddleware(["ADMIN"]), newExamination); // Only teachers & admins
router.get("/all", authMiddleware(), getAllExaminations); // Protected
router.get("/class/:id", authMiddleware(), getExaminationsByClass); // Protected
router.patch("/update/:id", authMiddleware(["ADMIN"]), updateExaminationWithId);
router.delete(
  "/delete/:id",
  authMiddleware(["ADMIN"]),
  deleteExaminationWithId
); // Only admins can delete

module.exports = router;
