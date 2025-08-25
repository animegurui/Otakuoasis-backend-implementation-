// server.js (ES module)
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import IORedis from 'ioredis';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import bcrypt from 'bcryptjs'; // using bcryptjs to avoid native compile issues

// Import routes (make sure these files exist in your repo)
import authRoutes from './routes/auth.js';
import animeRoutes from './routes/anime.js';
import historyRoutes from './routes/history.js';
import adminRoutes from './routes/admin.js';

// Import models used here
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- Logger --------------------
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'combined.log' }) // optional
  ],
});

// -------------------- Middleware --------------------
app.use(cors());
app.use(express.json());

// Basic rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // limit each IP
});
app.use(limiter);

// Simple request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// -------------------- MongoDB Connection --------------------
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/animeDB';

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to MongoDB');
    // Create admin user if required AFTER DB connection
    createAdminUserIfNeeded();
  })
  .catch(err => {
    logger.error('MongoDB connection error: ' + err.message);
    process.exit(1);
  });

// -------------------- Redis Connection --------------------
const REDIS_URL = process.env.REDIS_URL || process.env.REDIS || 'redis://127.0.0.1:6379';
export const redisClient = new IORedis(REDIS_URL);

redisClient.on('connect', () => logger.info('Connected to Redis'));
redisClient.on('error', (err) => logger.error('Redis error: ' + err.message));

// -------------------- Routes --------------------
// Prefix routes as needed. Adjust paths if your route files use different mounts.
app.use('/auth', authRoutes);         // signup, login
app.use('/anime', animeRoutes);       // trending, search, episodes, sources (e.g. /anime/trending)
app.use('/history', historyRoutes);   // protected - add/get history
app.use('/admin', adminRoutes);       // admin-only routes (should be protected in that route file)

// Health-check
app.get('/', (req, res) => res.json({ ok: true, message: 'Anime backend running' }));

// -------------------- Admin user creation --------------------
/**
 * createAdminUserIfNeeded()
 * - Reads ADMIN_EMAIL and ADMIN_PASSWORD from environment variables.
 * - If provided and user does not exist, creates the admin user with role 'admin'.
 * - Uses bcryptjs to hash the password.
 *
 * IMPORTANT: Do NOT put ADMIN_PASSWORD in your repo. Set it in the Render environment variables or .env (local only).
 */
async function createAdminUserIfNeeded() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      logger.info('ADMIN_EMAIL/ADMIN_PASSWORD not provided - skipping admin creation.');
      return;
    }

    // Check if the admin user already exists
    const existing = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existing) {
      logger.info(`Admin user already exists: ${adminEmail}`);
      return;
    }

    // Create the admin user
    const hashed = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      email: adminEmail.toLowerCase(),
      password: hashed,
      role: 'admin',
    });

    await adminUser.save();
    logger.info(`Created admin user: ${adminEmail}`);
  } catch (err) {
    logger.error('Error creating admin user: ' + (err.message || err));
  }
}

// -------------------- Start server --------------------
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
