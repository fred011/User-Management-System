const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema({
  examDate: { type: Date, required: true },
  examType: { type: String, required: true },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Examination", examinationSchema);
