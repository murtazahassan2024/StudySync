//Following is the new way of importing packages
//ES6 Module syntax
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/dbConnection.js';
import studyGroupRoutes from './routes/studyGroupRoutes.js';
import userRoutes from './routes/userRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: './config.env' });
// Fix env configuration

//This is an Express App
const app = express();
const connectionString = process.env.mongoURI;
connectDB(connectionString);
//Express middleware to parse the body from the incoming request
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
}
app.use(
    cors({
        origin: '*',
    })
);

//tales 2 arguments
//1: Route name
//2: Callback function that gets executed when a request is received
app.get('/', (req, res) => {
    res.send({
        msg: 'Server is running',
    });
});

//request for root server adrees
// ======================>CheckPoint 1<=====================

app.use('/api/users', userRoutes);

// ======================>CheckPoint 2<=====================

app.use('/api/password', passwordRoutes);


// ======================>CheckPoint 3<=====================
app.use('/api/studygroup', studyGroupRoutes)

//this app is an EXpress APP ,
app.use(notFound);
// so errorHandler give a nice formatting to the erorr
app.use(errorHandler);
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
