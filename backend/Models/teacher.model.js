const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  qualification: { type: String },
  age: { type: String },
  gender: { type: String },
  phone_number: { type: String },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  createdAt: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model("Teacher", teacherSchema);
