const { Progress } = require("../model/progressSchema");
const saveProgress = async (req, res) => {
  const { lessonId, sessionId, completed, tabsCompleted, activitiesDone } =
    req.body;
  const userId = req.currentUser.id;
  const progress = await Progress.findOneAndUpdate(
    {
      userId: userId,
      lessonId: lessonId,
      sessionId: sessionId,
    },
    {
      $set: {
        completed: completed,
        tabsCompleted: tabsCompleted,
        updatedAt: Date.now(),
      },
      $addToSet: {
        activitiesDone: { $each: activitiesDone || [] },
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    status: "success",
    message: "تم حفظ التقدم بنجاح",
    data: progress,
  });
};
getSessionProgress = async (req, res) => {
  const { userId, lessonId, sessionId } = req.params;

  const progress = await Progress.findOne({
    userId,
    lessonId,
    sessionId,
  });

  if (!progress) {
    return res.status(200).json({
      status: "success",
      data: {
        completed: false,
        tabsCompleted: [],
        activitiesDone: [],
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: progress,
  });
};
module.exports = { saveProgress, getSessionProgress };
