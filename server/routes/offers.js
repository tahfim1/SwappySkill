import express from 'express';
import Offer from '../models/Offer.js';

const router = express.Router();

/**
 * Create a new offer
 * body: { proposer, receiver, proposeSkillTitle, requestSkillTitle }
 */
router.post('/', async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * List offers for a user (as proposer or receiver)
 * /api/offers?username=abc
 */
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;
    const offers = await Offer.find({
      $or: [{ proposer: username }, { receiver: username }]
    }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get a single offer
 */
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Accept / Reject / Cancel
 */
router.put('/:id/accept', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { status: 'Accepted' }, { new: true });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/:id/reject', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/:id/cancel', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
