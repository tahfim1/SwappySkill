import express from 'express';
import Session from '../models/Session.js';
import Skill from '../models/skill.js';
import User from '../models/User.js';
import PointTransaction from '../models/PointTransaction.js';

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
    username, type, amount: Math.abs(delta), note
  });
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
      scheduledAt
    });

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
    await adjustPoints(session.requesterUsername, -10, `Booked session: ${session.skillTitle}`, 'spend');

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
      await adjustPoints(session.requesterUsername, +10, `Refund for cancelled session: ${session.skillTitle}`, 'refund');
    }

    session.status = 'Cancelled';
    await session.save();
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
    await adjustPoints(session.ownerUsername, +10, `Completed session: ${session.skillTitle}`, 'earn');

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
