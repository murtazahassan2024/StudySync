import mongoose from 'mongoose';

const chatMessageSchema = mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            //mongoose.Schema.Types.ObjectId
            //
            required: true,
            ref: 'Users', // Reference to the User model
        },
        studyGroup: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'StudyGroups', // Reference to the StudyGroup model
        },
    },
    {
        timestamps: true, // This will automatically add createdAt and updatedAt timestamps
    }
);

const ChatMessage = mongoose.model('ChatMessages', chatMessageSchema);

export default ChatMessage;
