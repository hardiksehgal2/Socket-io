import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Enable CORS Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

io.on("connection", (socket) => {
  console.log("Client Connected:", socket.id);

  // User joins a room
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  // Receiving message from client and sending it to a specific room
  socket.on("message", ({ room, message }) => {
    console.log(`Data received from ${socket.id}: ${message} (Room: ${room})`);
    io.to(room).emit("recived-message", { message, from: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log("Listening on port", port);
});
