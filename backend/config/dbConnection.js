import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

const connectDB = async (uri) => {
    try {
        // Set the strictQuery option
        mongoose.set('strictQuery', true);  // or false, based on your preference

        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected', conn.connection.host);
    } catch (err) {
        console.log(err);
    }
};

export default connectDB;
