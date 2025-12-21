const express = require("express");
const Subject = require("../models/Subject");
const Result = require("../models/Result");
const Material = require("../models/Material");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/subjects
// @desc    Get all subjects with user progress
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const subjects = await Subject.find();

    // Get user's results for progress tracking
    const userResults = await Result.find({ userId: req.user._id });
    const resultsMap = {};
    userResults.forEach((result) => {
      resultsMap[result.subjectId.toString()] = result;
    });

    // Check for assigned materials
    // We want to know if there is AT LEAST ONE material assigned to this user for each subject
    const materials = await Material.find({ assignedTo: req.user._id }).select(
      "subjectId"
    );
    const materialSubjects = new Set(
      materials.map((m) => m.subjectId.toString())
    );

    // Add progress info to subjects
    const subjectsWithProgress = subjects.map((subject) => {
      const result = resultsMap[subject._id.toString()];
      return {
        _id: subject._id,
        name: subject.name,
        icon: subject.icon,
        color: subject.color,
        description: subject.description,
        completed: !!result,
        score: result ? result.score : null,
        status: result ? result.status : null,
        hasMaterials: materialSubjects.has(subject._id.toString()),
      };
    });

    res.json(subjectsWithProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/subjects/:id
// @desc    Get single subject
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
