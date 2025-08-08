import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  level: String,
  createdBy: String
});

export default mongoose.model('Skill', skillSchema);
