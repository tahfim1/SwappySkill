import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user profile
router.put("/:id", async (req, res) => {
  const { bio, bloodGroup, studyLevel, location } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { bio, bloodGroup, studyLevel, location },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by username
router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
