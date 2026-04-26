const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const initSocket = require("./socket");

const serviceRoutes = require("./routes/serviceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRouter = require("./routes/authRoutes");
const messageRouter = require("./routes/messageRoutes");
const adminRouter = require("./routes/adminRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const cartRouter = require("./routes/cartRoutes");

const PORT = process.env.PORT || 3000;

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(logger("dev"));

// Initialise Socket.io and attach to app so controllers can emit events
const io = initSocket(server);
app.set("io", io);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRouter);
app.use("/api/admin", adminRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/cart", cartRouter);

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error("MongoDB unavailable, starting API without DB connection.");
    console.error(err.message);
  }

  server.listen(PORT, () => {
    console.log(`The express app is ready on port ${PORT}!`);
  });
};

startServer();
