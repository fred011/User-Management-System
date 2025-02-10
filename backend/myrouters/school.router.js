const express = require("express");
const authMiddleware = require("../Auth/auth");
const {
  registerSchool,
  getAllSchools,
  loginSchool,
  updateSchool,
  getSchoolOwnData,
} = require("../Controllers/school.controller");

const router = express.Router();

router.post("/register", registerSchool);
router.get("/all", getAllSchools);
router.get("/login", loginSchool);
router.patch("/update", authMiddleware(["SCHOOL"]), updateSchool);
router.get("/fetch-single", authMiddleware(["SCHOOL"]), getSchoolOwnData);

module.exports = router;
