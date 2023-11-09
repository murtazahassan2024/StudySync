// ES6 Module syntax
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/dbConnection.js';
import studyGroupRoutes from './routes/studyGroupRoutes.js';
import userRoutes from './routes/userRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// Setup for __dirname in ES6 module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: './config.env' });

// Connect to database
const app = express();
const connectionString = process.env.mongoURI;
connectDB(connectionString);

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// HTTP Server
const httpServer = createServer(app);

// Socket.io setup
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // Be sure to set the correct origin in production
    methods: ['GET', 'POST'],
  }
});

// WebSocket event listeners
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Function to notify group about schedule changes
export const notifyGroupScheduleChange = (groupId, schedule) => {
  io.to(groupId).emit('scheduleChange', schedule);
};

// Routes
app.get('/', (req, res) => {
    res.send({ msg: 'Server is running' });
});
app.use('/api/users', userRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/studygroup', studyGroupRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server with the HTTP server instance
const PORT = process.env.PORT || 8001;
httpServer.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));

