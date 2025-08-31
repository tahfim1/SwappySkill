import express from "express";
import Skill from "../models/skill.js";

const router = express.Router();

// Search + filter
router.get("/", async (req, res) => {
  try {
    const { q, category, level } = req.query;

    let filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { level: { $regex: q, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (level) filter.level = level;

    const skills = await Skill.find(filter);
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
