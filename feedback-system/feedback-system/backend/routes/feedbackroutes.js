const express = require("express");
const Feedback = require("../models/Feedback");
const protect = require("../middleware/authMiddleware");
const sendNotification = require("../utils/sendNotification");

const router = express.Router();

// ✅ Submit feedback (for logged-in users)
router.post("/", protect, async (req, res) => {
  try {
    // Log to verify request body and user
    console.log("Feedback POST Body:", req.body);
    console.log("User:", req.user);

    // Validate input
    const { message, rating } = req.body;
    if (!message || !rating) {
      return res.status(400).json({ message: "Message and rating are required" });
    }

    // Create feedback
    const feedback = new Feedback({
      user: req.user._id,
      message,
      rating,
    });

    await feedback.save();

    // Send email notification (optional)
    try {
      await sendNotification(
        req.user.email,
        "Feedback Submitted",
        "Thanks for your feedback!"
      );
    } catch (err) {
      console.error("Notification failed:", err.message);
    }

    res.status(201).json({ message: "Feedback received" });
  } catch (err) {
    console.error("Error saving feedback:", err.message);
    res.status(500).json({ message: "Server error while saving feedback" });
  }
});

// ✅ View all feedbacks (admin only)
router.get("/all", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const feedbacks = await Feedback.find().populate("user", "name email");
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedbacks:", err.message);
    res.status(500).json({ message: "Failed to retrieve feedbacks" });
  }
});

// ✅ Export feedback as downloadable JSON file (admin only)
router.get("/export", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const feedbacks = await Feedback.find().populate("user", "name email").lean();
    const filename = "feedback_export.json";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(feedbacks, null, 2));
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).send("Error exporting feedback.");
  }
});

module.exports = router;
