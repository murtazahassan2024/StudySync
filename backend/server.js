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
import mongoose from 'mongoose'; // Import Mongoose
import ChatMessage from '/Users/murtazahassan/Desktop/StudySync/backend/models/chatModel.js'

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

// Create HTTP server
const httpServer = createServer(app);

// Create a Socket.IO instance that listens on the httpServer
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: '*', // Change this to allow connections from your frontend domain
    },
});

// Define the Chat model using Mongoose (adjust the schema as needed)

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Get the userId from the socket connection
    console.log(`User with ID ${userId} connected`);
    console.log('New user connected');

    socket.on('joinStudyGroup', async (studyGroupId) => {
        socket.join(studyGroupId); // Join the socket to a room named after the studyGroup ID
        // Fetch and emit previous messages...
    });

    // Add the leaveStudyGroup event
    socket.on('leaveStudyGroup', (studyGroupId) => {
        socket.leave(studyGroupId); // Leave the socket room
        console.log(`User left study group ${studyGroupId}`);
        // You can add additional logic here if needed
    });

    socket.on('joinStudyGroup', async (studyGroupId) => {
        socket.join(studyGroupId); // Join the socket to a room named after the studyGroup ID
        // Fetch and emit previous messages as before...
    });

    // Handle receiving a new message
    socket.on('newMessage', async (data) => {
        try {
            // Create a new message in the database
            const newMessage = await ChatMessage.create({
                message: data.message,
                user: data.userId, // Store the user ID
                studyGroup: data.studyGroup // Study group ID
            });

            // Emit the new message to all clients in the study group
            io.to(data.studyGroup).emit('newMessage', newMessage);
        } catch (err) {
            console.log(err);
            // Handle errors, maybe send a message back to the user
        }
    });

    // Optionally, you could add logic to fetch historical messages when a user joins
    socket.on('joinStudyGroup', async (studyGroupId) => {
        try {
            const messages = await ChatMessage.find({ studyGroup: studyGroupId })
                .limit(50) // Adjust limit as needed
                
            socket.emit('previousMessages', messages);
        } catch (err) {
            console.log(err);
            // Handle errors
        }
    });


    // Handling user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
        // You can add more logic here if needed
    });
});

// Standard Express routes
app.get('/', (req, res) => {
    res.send({ msg: 'Server is running' });
});
app.use('/api/users', userRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/studygroup', studyGroupRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8001;
httpServer.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));