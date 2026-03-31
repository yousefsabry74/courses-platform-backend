const mongoose = require("mongoose");
const { Session } = require("../model/sessionSchema");
const getAllSessions = async (req, res) => {
  const { lessonId } = req.params;

  const sessions = await Session.find({
    lessonId: new mongoose.Types.ObjectId(lessonId),
  });

  res.status(200).json({
    status: "success",
    data: sessions,
  });
};
const getSingleSession = async (req, res) => {
  const { lessonId, sessionId } = req.params;

  const session = await Session.findOne({
    id: sessionId,
    lessonId: new mongoose.Types.ObjectId(lessonId),
  });

  if (!session) {
    return res.status(404).json({
      status: "error",
      message: "Session not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: session,
  });
};
const editSession = async (req, res) => {
  const { lessonId, sessionId } = req.params;

  const updatedSession = await Session.findOneAndUpdate(
    { id: sessionId, lessonId: new mongoose.Types.ObjectId(lessonId) },
    req.body,
    { new: true, runValidators: true },
  );

  if (!updatedSession) {
    return res.status(404).json({
      status: "error",
      message: "Session not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: updatedSession,
  });
};
module.exports = { editSession, getAllSessions, getSingleSession };
