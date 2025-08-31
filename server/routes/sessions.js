import express from 'express';
import Session from '../models/Session.js';
import Skill from '../models/skill.js';
import User from '../models/User.js';
import PointTransaction from '../models/PointTransaction.js';
import { createNotification } from '../utils/createNotification.js'; // <-- helper for notifications

const router = express.Router();

/**
 * Helper: change points and record transaction
 */
async function adjustPoints(username, delta, note, type) {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found: ' + username);
  user.points = (user.points || 0) + delta;
  await user.save();
  await PointTransaction.create({
    username,
    type,
    amount: Math.abs(delta),
    note
  });
  return user._id; // return userId for notifications
}

/**
 * Create a session request
 * body: { skillId, scheduledAt, requesterUsername }
 */
router.post('/', async (req, res) => {
  try {
    const { skillId, scheduledAt, requesterUsername } = req.body;
    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    const session = await Session.create({
      skillId,
      skillTitle: skill.title,
      ownerUsername: skill.createdBy,
      requesterUsername,
      scheduledAt,
      status: 'Pending'
    });

    // Notify skill owner
    const owner = await User.findOne({ username: skill.createdBy });
    if (owner) {
      await createNotification(owner._id, `${requesterUsername} requested a session for "${skill.title}"`);
    }

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * List sessions for a user (owner or requester)
 * /api/sessions?username=abc
 */
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;
    const sessions = await Session.find({
      $or: [{ ownerUsername: username }, { requesterUsername: username }]
    }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get a single session
 */
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Accept a session (owner action) → deduct points from requester (e.g., 10)
 */
router.put('/:id/accept', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.status = 'Accepted';
    await session.save();

    // Deduct points from requester
    const requesterId = await adjustPoints(session.requesterUsername, -10, `Booked session: ${session.skillTitle}`, 'spend');

    // Notify requester
    await createNotification(requesterId, `Your session "${session.skillTitle}" has been accepted by ${session.ownerUsername}`);

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Cancel a session (either party) → refund if was Accepted
 */
router.put('/:id/cancel', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.status === 'Accepted') {
      const requesterId = await adjustPoints(session.requesterUsername, +10, `Refund for cancelled session: ${session.skillTitle}`, 'refund');

      // Notify requester about refund
      await createNotification(requesterId, `Your session "${session.skillTitle}" was cancelled. Points refunded.`);
    }

    session.status = 'Cancelled';
    await session.save();

    // Notify owner
    const owner = await User.findOne({ username: session.ownerUsername });
    if (owner) {
      await createNotification(owner._id, `Session "${session.skillTitle}" has been cancelled.`);
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Complete a session (owner action) → award points to owner (e.g., 10)
 */
router.put('/:id/complete', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.status = 'Completed';
    await session.save();

    // Award points to owner
    const ownerId = await adjustPoints(session.ownerUsername, +10, `Completed session: ${session.skillTitle}`, 'earn');

    // Notify owner
    await createNotification(ownerId, `You earned points for completing session "${session.skillTitle}"`);

    // Notify requester
    const requester = await User.findOne({ username: session.requesterUsername });
    if (requester) {
      await createNotification(requester._id, `Your session "${session.skillTitle}" has been marked as completed`);
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
