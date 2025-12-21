const express = require("express");
const Question = require("../models/Question");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/questions/:subjectId
// @desc    Get quiz questions for a subject (non-remedial)
// @access  Private
router.get("/:subjectId", protect, async (req, res) => {
  try {
    const { fresh } = req.query;
    const subjectId = req.params.subjectId;

    // Check if we need to generate fresh questions
    let questions = [];

    // If not requesting fresh, try to find existing non-remedial questions
    if (fresh !== "true") {
      questions = await Question.find({
        subjectId: subjectId,
        isRemedial: false,
      }).limit(10);
    }

    // If no questions found or fresh questions requested, generate new ones
    if (questions.length === 0 || fresh === "true") {
      const Subject = require("../models/Subject");
      const { generateQuestions } = require("../services/geminiService");

      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      console.log(`Generating new questions for ${subject.name}...`);
      const generatedQuestions = await generateQuestions(subject.name, 5, "beginner");

      if (generatedQuestions.length > 0) {
        // Save to DB
        const questionsToSave = generatedQuestions.map(q => ({
          ...q,
          subjectId: subjectId,
          isRemedial: false
        }));

        // Optionally clear old questions for this subject/type if you want to keep DB clean
        // await Question.deleteMany({ subjectId, isRemedial: false });

        questions = await Question.insertMany(questionsToSave);
      } else {
        console.log("Generation failed or returned empty. Falling back to existing questions if available.");
        // If generation failed, try to fetch existing questions again (even if they are old)
        if (questions.length === 0) {
          questions = await Question.find({
            subjectId: subjectId,
            isRemedial: false,
          }).limit(10);
        }
      }
    }

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this subject" });
    }

    // Don't send correct answer to client during quiz
    const questionsForQuiz = questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json(questionsForQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/questions/:subjectId/remedial
// @desc    Get remedial practice questions for a subject
// @access  Private
router.get("/:subjectId/remedial", protect, async (req, res) => {
  try {
    const questions = await Question.find({
      subjectId: req.params.subjectId,
      isRemedial: true,
    });

    if (questions.length === 0) {
      // Fallback to regular questions if no remedial questions
      const regularQuestions = await Question.find({
        subjectId: req.params.subjectId,
      }).limit(5);

      const questionsForPractice = regularQuestions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
      }));

      return res.json(questionsForPractice);
    }

    const questionsForPractice = questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json(questionsForPractice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
