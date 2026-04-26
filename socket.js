const { Server } = require("socket.io");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join a personal room using userId (for notifications)
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user:${userId}`);
    });

    // Join a booking chat room
    socket.on("joinRoom", (bookingId) => {
      socket.join(`booking:${bookingId}`);
    });

    // Leave a booking chat room
    socket.on("leaveRoom", (bookingId) => {
      socket.leave(`booking:${bookingId}`);
    });

    // Send a chat message via socket directly (fallback)
    socket.on("message:send", ({ bookingId, senderId, content }) => {
      io.to(`booking:${bookingId}`).emit("message:new", {
        bookingId,
        senderId,
        content,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initSocket;
