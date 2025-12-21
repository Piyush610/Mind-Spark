const express = require("express");
const Material = require("../models/Material");
const { protect, teacherOnly } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/materials
// @desc    Add a new learning material
// @access  Private (Teacher)
router.post("/", protect, teacherOnly, async (req, res) => {
  try {
    const { subjectId, title, type, content, description, assignedTo } =
      req.body;

    const material = await Material.create({
      subjectId,
      title,
      type,
      content,
      description,
      createdBy: req.user._id,
      assignedTo: assignedTo || [], // Array of student IDs
    });

    res.status(201).json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/materials/:subjectId
// @desc    Get all materials for a subject (Filtered for students)
// @access  Private
router.get("/:subjectId", protect, async (req, res) => {
  try {
    let query = { subjectId: req.params.subjectId };

    // If student, only show assigned materials or public ones (if we had public)
    // Here, we strict to "assignedTo must contain user ID"
    if (req.user.role === "student") {
      query.assignedTo = req.user._id;
    }

    const materials = await Material.find(query)
      .populate("createdBy", "name")
      .populate("assignedTo", "name") // Populate for teacher to see who is assigned
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/materials/:id
// @desc    Delete a material
// @access  Private (Teacher)
router.delete("/:id", protect, teacherOnly, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    await material.deleteOne();
    res.json({ message: "Material removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
