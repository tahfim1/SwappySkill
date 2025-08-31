import express from 'express';
import Offer from '../models/Offer.js';
import User from '../models/User.js';
import { createNotification } from '../utils/createNotification.js'; // helper function

const router = express.Router();

/**
 * Create a new offer
 * body: { proposer, receiver, proposeSkillTitle, requestSkillTitle }
 */
router.post('/', async (req, res) => {
  try {
    const offer = await Offer.create(req.body);

    // Notify the receiver about new offer
    const receiver = await User.findOne({ username: offer.receiver });
    if (receiver) {
      await createNotification(receiver._id, `${offer.proposer} sent you an offer to exchange "${offer.proposeSkillTitle}" with "${offer.requestSkillTitle}"`);
    }

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
 * Accept / Reject / Cancel offers with notifications
 */
router.put('/:id/accept', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { status: 'Accepted' }, { new: true });

    // Notify proposer
    const proposer = await User.findOne({ username: offer.proposer });
    if (proposer) {
      await createNotification(proposer._id, `${offer.receiver} accepted your offer for "${offer.proposeSkillTitle}"`);
    }

    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/reject', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });

    // Notify proposer
    const proposer = await User.findOne({ username: offer.proposer });
    if (proposer) {
      await createNotification(proposer._id, `${offer.receiver} rejected your offer for "${offer.proposeSkillTitle}"`);
    }

    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/cancel', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });

    // Notify receiver
    const receiver = await User.findOne({ username: offer.receiver });
    if (receiver) {
      await createNotification(receiver._id, `${offer.proposer} cancelled the offer for "${offer.proposeSkillTitle}"`);
    }

    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
