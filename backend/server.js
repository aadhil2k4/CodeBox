const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// Create an Express app
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Enable CORS for cross-origin requests
app.use(cors());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from React frontend
    methods: ['GET', 'POST']
  }
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for code updates from one user and broadcast it to others
  socket.on('code_change', (data) => {
    console.log('Code updated:', data);
    // Broadcast the code changes to all other connected users
    socket.broadcast.emit('receive_code', data);
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Define a basic route for testing
app.get('/', (req, res) => {
  res.send('Socket.IO server is running!');
});

// Start the server on port 5000
server.listen(4000, () => {
  console.log('Server is running on port 5000');
});
