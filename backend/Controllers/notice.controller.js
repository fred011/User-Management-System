const Notice = require("../Models/notice.model");

module.exports = {
  getAllNotices: async (req, res) => {
    try {
      const allNotices = await Notice.find();
      res.status(200).json({
        success: true,
        message: "Successfully fetched all Notices ",
        data: allNotices,
      });
    } catch (error) {
      console.log("Get all notices Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in fetching Notices" });
    }
  },
  getTeacherNotices: async (req, res) => {
    try {
      const allNotices = await Notice.find({ audience: "teacher" });
      res.status(200).json({
        success: true,
        message: "Successfully fetched all Teacher Notices ",
        data: allNotices,
      });
    } catch (error) {
      console.log("Get all notices Error => ", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Server error in fetching Teacher Notices",
        });
    }
  },
  getStudentNotices: async (req, res) => {
    try {
      const allNotices = await Notice.find({ audience: "student" });
      res.status(200).json({
        success: true,
        message: "Successfully fetched all Student Notices ",
        data: allNotices,
      });
    } catch (error) {
      console.log("Get all notices Error => ", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Server error in fetching Student Notices",
        });
    }
  },
  createNotice: async (req, res) => {
    try {
      const { title, message, audience } = req.body;
      const newNotice = new Notice({
        title: title,
        message: message,
        audience: audience,
      });
      await newNotice.save();
      res
        .status(200)
        .json({ success: true, message: "Notice Created Successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server error in Creating Notice" });
    }
  },
  updateNoticeWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Notice.findByIdAndUpdate({ _id: id }, { $set: { ...req.body } });
      const noticeAfterUpdate = await Notice.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Notice Updated Successfully",
        data: noticeAfterUpdate,
      });
    } catch (error) {
      console.log("Update notice Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in Updating Notice" });
    }
  },
  deleteNoticeWithId: async (req, res) => {
    try {
      let id = req.params.id;

      await Notice.findByIdAndDelete({ _id: id });
      res
        .status(200)
        .json({ success: true, message: "Notice Deleted Successfully" });
    } catch (error) {
      console.log("Delete notice Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in Deleting Notice" });
    }
  },
};
