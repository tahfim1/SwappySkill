import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get all messages for an offer
router.get('/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params;
    const msgs = await Message.find({ offerId }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message to an offer
router.post('/', async (req, res) => {
  try {
    // body: { offerId, sender, text }
    const msg = await Message.create(req.body);
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
