const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const authRouter = require('./routes/authRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const cartRouter = require('./routes/cartRoutes');
const adminRouter = require('./routes/adminRoutes');

const PORT = Number(process.env.PORT) || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api';
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server calls and local tools with no Origin header.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/bookings`, bookingRouter);
app.use(`${API_PREFIX}/reviews`, reviewRouter);
app.use(`${API_PREFIX}/services`, serviceRouter);
app.use(`${API_PREFIX}/cart`, cartRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);

// Backward-compatible routes for clients that still call non-prefixed paths.
app.use('/auth', authRouter);
app.use('/bookings', bookingRouter);
app.use('/reviews', reviewRouter);
app.use('/services', serviceRouter);
app.use('/cart', cartRouter);
app.use('/admin', adminRouter);

app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ status: 'ok' });
});


app.listen(PORT, () => {
  console.log(`The express app is ready on port ${PORT}.`);
});
