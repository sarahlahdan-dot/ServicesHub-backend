const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const authRouter = require('./routes/authRoutes');
const messageRouter = require('./routes/messageRoutes');
const adminRouter = require('./routes/adminRoutes');


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use('/auth', authRouter);
app.use('/messages', messageRouter);
app.use('/admin', adminRouter);

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});


app.listen(3000, () => {
  console.log('The express app is ready!');
});
