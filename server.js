import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import authRoutes from './routes/auth.js';
import animeRoutes from './routes/anime.js';
import historyRoutes from './routes/history.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});
app.use(limiter);

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.error(err));

// API routes
app.use('/auth', authRoutes);
app.use('/anime', animeRoutes);
app.use('/history', authMiddleware, historyRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Anime streaming backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
