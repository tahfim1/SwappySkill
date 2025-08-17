import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  skillTitle: String,
  ownerUsername: String,     // the skill owner (teacher)
  requesterUsername: String, // the one who requests this session (learner)
  scheduledAt: Date,
  status: { type: String, enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Session', sessionSchema);
