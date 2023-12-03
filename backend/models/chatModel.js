import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    message: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to your User model
    },
    studyGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyGroup' // Reference to your StudyGroup model
    },
}, {
    timestamps: true // This will add createdAt and updatedAt fields automatically
});


const ChatMessage = mongoose.model('ChatMessages', chatMessageSchema);

export default ChatMessage;
