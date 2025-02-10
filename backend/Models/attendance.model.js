const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },
  student: { type: mongoose.Schema.ObjectId, ref: "Student" },
  class: { type: mongoose.Schema.ObjectId, ref: "Class" },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent"], default: "absent" },

  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
