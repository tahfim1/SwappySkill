import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 100 }, // starter balance
  bio: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  studyLevel: { type: String, default: "" },
  location: { type: String, default: "" },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }]
});

export default mongoose.model('User', userSchema);
