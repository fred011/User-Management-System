const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  // Reference to the school (if needed in the future)
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },

  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  student_class: { type: mongoose.Schema.ObjectId, ref: "Class" },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  guardian: { type: String, required: true },
  guardian_phone: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  createAt: { type: Date, default: new Date() },
  
});

module.exports = mongoose.model("Student", studentSchema);
