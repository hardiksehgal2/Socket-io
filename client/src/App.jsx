/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { Button, Container, TextField, Typography } from '@mui/material';

// Create a socket connection outside the component

const App = () => {
  const socket = useMemo(()=>io("http://localhost:3000"),[])
  const [message, setMessage] = useState("");
  const handleSubmit=(e)=>{
    e.preventDefault();
    socket.emit("message", message);
    setMessage("")
  }
  useEffect(() => {
    // Connect event
    socket.on('connect', () => {
      console.log('Connected to the server ', socket.id);
    });

    
    // Welcome message event from server
    socket.on("welcome", (s) => {
      console.log("Welcome message received from the server ", s);
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };

  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={e=>setMessage(e.target.value)} id='outlined-basic' label='Outlined' variant='outlined' />
        <Button type='submit' variant='contained' color='primary'>Send</Button>
      </form>
    </Container>
  );
}

export default App;
