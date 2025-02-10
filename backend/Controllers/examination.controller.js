const Examination = require("../Models/examination.model");

module.exports = {
  newExamination: async (req, res) => {
    try {
      const { date, subjectId, examType, classId } = req.body;
      const newExamination = new Examination({
        examDate: date,
        subject: subjectId,
        examType: examType,
        class: classId,
      });
      const savedData = await newExamination.save();
      res.status(200).json({
        success: true,
        message: "New examination created successfully.",
        data: savedData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating new examination.",
      });
    }
  },
  getAllExaminations: async (req, res) => {
    try {
      const examinations = await Examination.find();
      res.status(200).json({
        success: true,
        examinations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching all examinations.",
      });
    }
  },
  getExaminationsByClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const examinations = await Examination.find({ class: classId }).populate(
        "subject"
      );
      res.status(200).json({
        success: true,
        examinations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching examinations by class.",
        error: error.message,
      });
    }
  },
  updateExaminationWithId: async (req, res) => {
    try {
      const examinationId = req.params.id;
      const { date, subjectId, examType } = req.body;
      await Examination.findByIdAndUpdate(
        { _id: examinationId },
        {
          $set: {
            examDate: date,
            subject: subjectId,
            examType: examType,
          },
        }
      );

      res.status(200).json({
        success: true,
        message: "Examination updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating examination.",
        error: error.message,
      });
    }
  },
  deleteExaminationWithId: async (req, res) => {
    try {
      const examinationId = req.params.id;
      await Examination.findOneAndDelete({ _id: examinationId });

      res.status(200).json({
        success: true,
        message: "Examination deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting examination.",
        error: error.message,
      });
    }
  },
};
