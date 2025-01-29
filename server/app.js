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

// app.use(
//   cors({
//     origin: "http://localhost:5173/",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );
app.get("/", (req, res) => {
  res.send("hello world!");
});

io.on("connection", (socket) => {
  console.log("Socket ID", socket.id);
  //   socket.emit("welcome",`Welcome to the WebSocket ${socket.id}`);
  //   socket.broadcast.emit("welcome", `Welcome to the WebSocket ${socket.id}`);
  socket.on("disconnect", ()=>{
    console.log("User disconnected ", socket.id);
  });

  socket.on("message",(data)=>{
    console.log("Data received ", data);
    // io.emit("message", data);
  })
});

server.listen(port, () => {
  console.log("listening on ", port);
});
