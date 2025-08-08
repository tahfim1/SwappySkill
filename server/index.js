import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import skillRoutes from './routes/skills.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // 👈 Ensure this is here before routes

app.use('/api/auth', authRoutes);     // http://localhost:5000/api/auth/login or /register
app.use('/api/skills', skillRoutes);  // your skills routes

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err));
