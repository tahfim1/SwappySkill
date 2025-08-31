import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  from: { type: String, required: true }, // store username
  to: { type: String, required: true },   // store username
  score: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Rating", ratingSchema);
