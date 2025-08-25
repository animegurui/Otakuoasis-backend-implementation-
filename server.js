import express from 'express';
import mongoose from 'mongoose';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import winston from 'winston';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import trendingRoutes from './routes/trending.js';
import searchRoutes from './routes/search.js';
import episodesRoutes from './routes/episodes.js';
import sourcesRoutes from './routes/episodeSources.js';
import historyRoutes from './routes/history.js';

import User from './models/User.js';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup logger (Winston)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // Additional transports (e.g. file logs) can be added here
  ],
});

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

// Connect to Redis
const redisClient = new IORedis(process.env.REDIS_URL);
redisClient.on('connect', () => logger.info('Connected to Redis'));
redisClient.on('error', (err) => logger.error('Redis error:', err));

// Create default admin user if not exists
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const adminUser = new User({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });
      await adminUser.save();
      logger.info('Default admin user created');
    }
  } catch (error) {
    logger.error('Error creating admin user:', error);
  }
};
createAdminUser();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting (prevent abuse; e.g. 100 requests per 15 min per IP)2
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/trending', trendingRoutes);
app.use('/search', searchRoutes);
app.use('/episodes', episodesRoutes);
app.use('/episode-sources', sourcesRoutes);
app.use('/history', historyRoutes);

app.get('/', (req, res) => {
  res.send('Anime streaming backend is running');
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export { redisClient };
