import express from "express";
import Rating from "../models/rating.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

const router = express.Router();

// GET ratings + average for a user
router.get("/:userId", async (req, res) => {
  try {
    const ratings = await Rating.find({ to: req.params.userId }).populate("from", "username");

    const avg =
      ratings.length > 0
        ? ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length
        : 0;

    res.json({ ratings, average: Number(avg.toFixed(1)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new rating
router.post("/", async (req, res) => {
  try {
    const { from, to, score, comment } = req.body;

    // Prevent self-rating: convert to string for safe comparison
    if (from.toString() === to.toString()) {
      return res.status(400).json({ error: "Cannot rate yourself" });
    }

    const rating = new Rating({ from, to, score, comment });
    await rating.save();

    // Notify rated user
    const ratedUser = await User.findById(to);
    if (ratedUser) {
      await createNotification(
        ratedUser._id,
        `${from} rated you ${score}/5: ${comment || "No comment"}`
      );
    }

    // Return updated ratings + average
    const allRatings = await Rating.find({ to }).populate("from", "username");
    const avg =
      allRatings.length > 0
        ? allRatings.reduce((acc, r) => acc + r.score, 0) / allRatings.length
        : 0;

    res.status(201).json({ ratings: allRatings, average: Number(avg.toFixed(1)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
