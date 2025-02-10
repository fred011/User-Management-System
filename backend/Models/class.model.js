const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },
  class_text: { type: String, requiredd: true },
  class_num: { type: String, requiredd: true },
  attendee: { type: mongoose.Schema.ObjectId, ref: "Teacher" },
  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Class", classSchema);
