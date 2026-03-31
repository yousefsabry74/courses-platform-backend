const { Progress } = require("../model/progressSchema");
const { QuizResult } = require("../model/quizResultSchema");
const { User } = require("../model/userSchema");

const saveProgress = async (req, res) => {
  const { lessonId, sessionId, completed, tabsCompleted, activitiesDone } =
    req.body;
  const userId = req.currentUser.id;

  const progress = await Progress.findOneAndUpdate(
    {
      userId,
      lessonId,
      sessionId,
    },
    {
      $set: {
        completed,
        tabsCompleted,
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

const getSessionProgress = async (req, res) => {
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

const saveQuizResult = async (req, res) => {
  const { lessonId, sessionId, answers, score, totalQuestions, correctAnswers } =
    req.body;
  const userId = req.currentUser.id;

  if (
    lessonId === undefined ||
    sessionId === undefined ||
    score === undefined ||
    totalQuestions === undefined ||
    correctAnswers === undefined
  ) {
    return res.status(400).json({
      status: "error",
      message: "بيانات النتيجة غير مكتملة",
    });
  }

  const quizResult = await QuizResult.findOneAndUpdate(
    {
      userId,
      lessonId,
      sessionId,
    },
    {
      $set: {
        answers: answers || {},
        score,
        totalQuestions,
        correctAnswers,
        submittedAt: new Date(),
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  res.status(200).json({
    status: "success",
    message: "تم حفظ درجة الاختبار بنجاح",
    data: quizResult,
  });
};

const getMyQuizResult = async (req, res) => {
  const { lessonId, sessionId } = req.params;
  const userId = req.currentUser.id;

  const result = await QuizResult.findOne({
    userId,
    lessonId,
    sessionId,
  }).lean();

  res.status(200).json({
    status: "success",
    data: result || null,
  });
};

const getMyQuizResults = async (req, res) => {
  const userId = req.currentUser.id;

  const results = await QuizResult.find({ userId })
    .sort({ submittedAt: -1 })
    .lean();

  const summary = results.reduce(
    (acc, result) => {
      acc.totalScore += result.score || 0;
      acc.completedSessions += 1;
      acc.highScore = Math.max(acc.highScore, result.score || 0);
      return acc;
    },
    {
      totalScore: 0,
      completedSessions: 0,
      highScore: 0,
    },
  );

  res.status(200).json({
    status: "success",
    data: {
      results,
      summary,
    },
  });
};

const getTeacherQuizOverview = async (req, res) => {
  const students = await User.find(
    { role: "student" },
    {
      password: false,
      __v: false,
    },
  ).lean();

  const quizResults = await QuizResult.find({}, { answers: false, __v: false })
    .sort({ submittedAt: -1 })
    .lean();

  const studentStats = new Map();

  for (const result of quizResults) {
    const userId = result.userId.toString();
    const current = studentStats.get(userId) || {
      completedSessions: 0,
      totalScore: 0,
      highScore: 0,
      latestResult: null,
    };

    current.completedSessions += 1;
    current.totalScore += result.score || 0;
    current.highScore = Math.max(current.highScore, result.score || 0);

    if (
      !current.latestResult ||
      new Date(result.submittedAt) > new Date(current.latestResult.submittedAt)
    ) {
      current.latestResult = result;
    }

    studentStats.set(userId, current);
  }

  const studentOverview = students.map((student) => {
    const stats = studentStats.get(student._id.toString()) || {
      completedSessions: 0,
      totalScore: 0,
      highScore: 0,
      latestResult: null,
    };

    return {
      id: student._id.toString(),
      username: student.username,
      email: student.email,
      class: student.class,
      grade: student.grade,
      role: student.role,
      displayName: student.displayName,
      avatar: student.avatar,
      completedSessions: stats.completedSessions,
      totalScore: stats.totalScore,
      highScore: stats.highScore,
      latestResult: stats.latestResult,
    };
  });

  const totalScore = quizResults.reduce(
    (sum, result) => sum + (result.score || 0),
    0,
  );

  res.status(200).json({
    status: "success",
    data: {
      students: studentOverview,
      summary: {
        totalStudents: students.length,
        totalQuizSubmissions: quizResults.length,
        averageScore: quizResults.length
          ? Math.round(totalScore / quizResults.length)
          : 0,
      },
    },
  });
};

module.exports = {
  saveProgress,
  getSessionProgress,
  saveQuizResult,
  getMyQuizResult,
  getMyQuizResults,
  getTeacherQuizOverview,
};
