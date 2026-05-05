import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust as needed for production
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    socket.on("join_trainer_room", (trainerId) => {
      socket.join(`trainer_${trainerId}`);
      console.log(`[Socket] Trainer joined room: trainer_${trainerId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

/**
 * Emit event to a specific trainer
 */
export const emitToTrainer = (trainerId, event, data) => {
  if (io) {
    io.to(`trainer_${trainerId}`).emit(event, data);
    console.log(`[Socket] Emitted ${event} to trainer_${trainerId}`);
  }
};
