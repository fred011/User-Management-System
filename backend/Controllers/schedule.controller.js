const Schedule = require("../Models/schedule.model"); // Assuming Schedule model is defined
const Class = require("../Models/class.model");
const Student = require("../Models/student.model");
const Exam = require("../Models/examination.model");
const mongoose = require("mongoose");

module.exports = {
  // Create a new schedule
  createSchedule: async (req, res) => {
    try {
      const { selectedClass, teacher, subject, startTime, endTime } = req.body;

      const newSchedule = new Schedule({
        classId: selectedClass,
        teacher,
        subject,
        startTime,
        endTime,
      });

      const savedSchedule = await newSchedule.save();
      res.status(201).json({
        message: "Schedule created successfully",
        data: savedSchedule,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating schedule", error });
    }
  },

  // Get schedule by class
  getScheduleWithClass: async (req, res) => {
    try {
      const classId = req.params.id;
      console.log("Received classId:", classId);

      if (!mongoose.Types.ObjectId.isValid(classId)) {
        console.log("Invalid classId provided:", classId);
        return res.status(400).json({ message: "Invalid classId provided." });
      }

      const schedules = await Schedule.find({
        classId: new mongoose.Types.ObjectId(classId),
      })
        .populate("classId") // Populates classId
        .populate("teacher") // Populates teacher
        .populate("subject"); // Populates subject
      console.log("Fetched schedules:", schedules);

      // if (!schedules.length) {
      //   console.log("No schedules found for class:", classId);
      //   return res
      //     .status(404)
      //     .json({ message: "No schedules found for this class." });
      // }

      res.status(200).json({
        success: true,
        message: "Schedules retrieved successfully.",
        data: schedules,
      });
    } catch (error) {
      console.error("Error in fetching schedules:", error);
      res
        .status(500)
        .json({ message: "Server Error in retrieving schedules", error });
    }
  },

  fetchScheduleWithId: async (req, res) => {
    try {
      const id = req.params.id;

      const schedule = (await Schedule.find({ _id: id }))[0];

      res.status(200).json({
        success: true,
        message: "Schedule retrieved successfully.",
        data: schedule,
      });
    } catch (error) {
      console.error("Error in fetching schedule:", error);
      res
        .status(500)
        .json({ message: "Server Error in retrieving schedule", error });
    }
  },

  // Update a schedule by ID
  updateScheduleWithId: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedSchedule = await Schedule.findByIdAndUpdate(id, updates, {
        new: true,
      });
      if (!updatedSchedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      res.status(200).json({
        message: "Schedule updated successfully",
        data: updatedSchedule,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating schedule", error });
    }
  },

  // Delete a schedule by ID
  deleteScheduleWithId: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedSchedule = await Schedule.findByIdAndDelete(id);
      if (!deletedSchedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting schedule", error });
    }
  },
};
