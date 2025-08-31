import express from 'express';
import User from '../models/User.js';
import PointTransaction from '../models/PointTransaction.js';
import { createNotification } from '../utils/createNotification.js';

const router = express.Router();

// Get current balance and last transactions
router.get('/balance/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transactions = await PointTransaction.find({ username }).sort({ createdAt: -1 }).limit(20);
    res.json({ balance: user.points || 0, transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin bonus (or any point addition)
router.post('/bonus', async (req, res) => {
  try {
    const { username, amount, note } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bonusAmount = Number(amount || 0);
    user.points = (user.points || 0) + bonusAmount;
    await user.save();

    await PointTransaction.create({
      username,
      type: 'bonus',
      amount: Math.abs(bonusAmount),
      note: note || 'Admin bonus'
    });

    // Notify the user about point addition
    await createNotification(
      user._id,
      `You received ${bonusAmount} points. Reason: ${note || 'Admin bonus'}`
    );

    res.json({ balance: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
