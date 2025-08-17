import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  proposer: String, // who started the offer
  receiver: String, // who receives the offer
  proposeSkillTitle: String, // I will teach you ...
  requestSkillTitle: String, // if you teach me ...
  status: { type: String, enum: ['Proposed', 'Accepted', 'Rejected', 'Cancelled'], default: 'Proposed' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Offer', offerSchema);
