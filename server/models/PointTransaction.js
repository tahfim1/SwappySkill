import mongoose from 'mongoose';

const pointTransactionSchema = new mongoose.Schema({
  username: String,
  type: { type: String, enum: ['earn', 'spend', 'bonus', 'refund'], required: true },
  amount: { type: Number, required: true },
  note: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('PointTransaction', pointTransactionSchema);
