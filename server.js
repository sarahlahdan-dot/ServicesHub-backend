const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const verifyToken = require('./middleware/verify-token');
const serviceRoutes = require('./routes/serviceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRouter = require('./routes/authRoutes');
const messageRouter = require('./routes/messageRoutes');
const adminRouter = require('./routes/adminRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const PORT = process.env.PORT || 3000;

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use("/api/auth", authRouter);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRouter);
app.use("/api/admin", adminRouter);
app.use("/api/bookings", bookingRouter);

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error('MongoDB unavailable, starting API without DB connection.');
    console.error(err.message);
  }

  app.listen(PORT, () => {
    console.log(`The express app is ready on port ${PORT}!`);
  });
};

startServer();
