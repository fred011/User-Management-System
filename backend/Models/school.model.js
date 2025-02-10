const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  school_name: { type: String, required: true },
  email: { type: String, reguire: true },
  admin: { type: String, reguire: true },
  password: { type: String, required: true },

  createAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("School", schoolSchema);
