import mongoose from 'mongoose';

const studyGroupSchema = mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            },
        ],
        studyTopics: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    },
);

const StudyGroup = mongoose.model('StudyGroups', studyGroupSchema);

export default StudyGroup;
