import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  sender: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
