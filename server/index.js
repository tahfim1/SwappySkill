import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import skillRoutes from './routes/skills.js';
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/sessions.js';
import offerRoutes from './routes/offers.js';
import messageRoutes from './routes/messages.js';
import pointRoutes from './routes/points.js';
import ratingRoutes from "./routes/ratings.js";
import notificationRoutes from "./routes/notifications.js";
import userRoutes from "./routes/users.js";
import searchRoutes from "./routes/search.js";

// ...



dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/points', pointRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

// DB + server
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port ' + PORT));
  })
  .catch(err => console.error(err));
