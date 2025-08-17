import express from 'express';
import User from '../models/User.js';
import PointTransaction from '../models/PointTransaction.js';

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

// (Optional) Admin bonus
router.post('/bonus', async (req, res) => {
  try {
    const { username, amount, note } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.points = (user.points || 0) + Number(amount || 0);
    await user.save();

    await PointTransaction.create({
      username, type: 'bonus', amount: Math.abs(amount), note: note || 'Admin bonus'
    });

    res.json({ balance: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
