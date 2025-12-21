const express = require("express");
const Question = require("../models/Question");
const Result = require("../models/Result");
const User = require("../models/User");
const { protect, teacherOnly } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers and calculate score
// @access  Private (Student)
router.post("/submit", protect, async (req, res) => {
  try {
    const { subjectId, answers } = req.body;
    // answers = [{ questionId, selectedAnswer }]

    // Check if already attempted
    const existingResult = await Result.findOne({
      userId: req.user._id,
      subjectId,
    });

    if (existingResult) {
      return res.status(400).json({
        message: "You have already attempted this quiz",
        result: existingResult,
      });
    }

    // Get questions with correct answers
    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Create a map for quick lookup
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q.correctAnswer;
    });

    // Calculate score
    let correctCount = 0;
    answers.forEach((answer) => {
      if (questionMap[answer.questionId] === answer.selectedAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = answers.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Determine status (40% threshold)
    const status = score >= 40 ? "doing_fine" : "needs_support";

    // Calculate XP earned (base 10 per question + bonus for high scores)
    let xpEarned = correctCount * 10;
    if (score >= 80) xpEarned += 50; // Bonus for excellent performance
    else if (score >= 60) xpEarned += 25; // Bonus for good performance

    // Create result
    const result = await Result.create({
      userId: req.user._id,
      subjectId,
      score,
      correctAnswers: correctCount,
      totalQuestions,
      status,
      xpEarned,
    });

    // Update user XP
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: xpEarned },
    });

    res.status(201).json({
      result,
      correctCount,
      totalQuestions,
      score,
      status,
      xpEarned,
      message:
        status === "doing_fine"
          ? "Great job! You are doing fine!"
          : "Keep practicing! Additional exercises are available.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/quiz/results/student
// @desc    Get logged-in student's results
// @access  Private (Student)
router.get("/results/student", protect, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate("subjectId", "name icon color")
      .sort({ submittedAt: -1 });

    const totalXP = results.reduce((sum, r) => sum + r.xpEarned, 0);

    res.json({
      results,
      totalXP,
      totalQuizzes: results.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/quiz/allow-retake
// @desc    Allow a student to retake a quiz (Teacher only)
// @access  Private (Teacher)
router.post("/allow-retake", protect, teacherOnly, async (req, res) => {
  try {
    const { resultId } = req.body;

    const result = await Result.findByIdAndUpdate(
      resultId,
      { retakeAllowed: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({ message: "Retake allowed for student", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/quiz/results/teacher
// @desc    Get all student results (teacher only)
// @access  Private (Teacher)
router.get("/results/teacher", protect, teacherOnly, async (req, res) => {
  try {
    const { subjectId, status } = req.query;

    let query = {};
    if (subjectId) query.subjectId = subjectId;
    if (status) query.status = status;

    const results = await Result.find(query)
      .populate("userId", "name email")
      .populate("subjectId", "name icon color")
      .sort({ submittedAt: -1 });

    // Group by status for summary (Unique Students)
    const uniqueTotal = new Set(results.map((r) => r.userId?._id.toString()));
    const uniqueDoingFine = new Set(
      results
        .filter((r) => r.status === "doing_fine")
        .map((r) => r.userId?._id.toString())
    );
    const uniqueNeedsSupport = new Set(
      results
        .filter((r) => r.status === "needs_support")
        .map((r) => r.userId?._id.toString())
    );

    const summary = {
      total: uniqueTotal.size,
      doingFine: uniqueDoingFine.size,
      needsSupport: uniqueNeedsSupport.size,
    };

    res.json({
      results,
      summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/quiz/results/:subjectId
// @desc    Get result for specific subject
// @access  Private
router.get("/results/:subjectId", protect, async (req, res) => {
  try {
    const result = await Result.findOne({
      userId: req.user._id,
      subjectId: req.params.subjectId,
    }).populate("subjectId", "name icon color");

    if (!result) {
      return res
        .status(404)
        .json({ message: "No result found for this subject" });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/quiz/reset
// @desc    Reset quiz result to allow retake
// @access  Private
router.post("/reset", protect, async (req, res) => {
  try {
    const { subjectId } = req.body;

    const result = await Result.findOne({
      userId: req.user._id,
      subjectId,
    });

    if (result) {
      // Check if retake is allowed by teacher
      if (!result.retakeAllowed) {
        return res
          .status(403)
          .json({ message: "Retake not authorized by teacher" });
      }

      // Deduct XP earned from this result
      if (result.xpEarned > 0) {
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { xp: -result.xpEarned },
        });
      }

      // Delete the result using deleteOne()
      await Result.deleteOne({ _id: result._id });
    }

    res.json({ message: "Quiz reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
