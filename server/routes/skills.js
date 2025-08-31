import express from 'express';
import Skill from '../models/skill.js';

const router = express.Router();

// GET all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET a single skill by ID (for editing)
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// POST new skill
router.post('/', async (req, res) => {
  try {
    const skill = new Skill({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      level: req.body.level,
      createdBy: req.body.createdBy || 'anonymous'
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE skill
router.put('/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        level: req.body.level,
      },
      { new: true }
    );

    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a skill
router.delete('/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
