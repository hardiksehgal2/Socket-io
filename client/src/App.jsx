/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';

// Create a socket connection outside the component

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), [])
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  // Join Room
  const handleJoinRoom = () => {
    if (room.trim() !== "") {
      socket.emit("join-room", room);
      console.log(`Joined room: ${room}`);
    }
  };

  // Send Message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (room.trim() === "") {
      alert("Please enter a room number before sending a message.");
      return;
    }
    socket.emit("message", { message, room });
    setMessage(""); // Clear input field
  };

  useEffect(() => {
    // Get socket ID when connected
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    // Listen for messages
    socket.on("recived-message", (data) => {
      console.log("Received message from server:", data);
      setMessages((messages) => [...messages, data]); // Store received messages
    });

    return () => {
      console.log("Disconnecting socket...");
      socket.off("recived-message"); // Cleanup event listener
      socket.disconnect(); // Disconnect socket when component unmounts
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 20 }} />
      <Typography variant="h6" component="div" gutterBottom>
        Your Socket ID: {socketId}
      </Typography>

      {/* Room Input */}
      <TextField
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        id="outlined-room"
        label="Room"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button onClick={handleJoinRoom} variant="contained" color="secondary">
        Join Room
      </Button>

      {/* Message Input */}
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-message"
          label="Message"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      {/* Message Display */}
      <Stack sx={{ marginTop: 2 }}>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m.from}: {m.message}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
