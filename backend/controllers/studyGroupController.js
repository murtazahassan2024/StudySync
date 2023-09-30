import asyncHandler from 'express-async-handler';
import StudyGroup from '../models/studyGroupModel.js';

// Create a new study group
const createStudyGroup = asyncHandler(async (req, res) => {
    const { groupName, location, startTime, endTime, members, studyTopics } =
        req.body;

    const newStudyGroup = await StudyGroup.create({
        groupName,
        location,
        startTime,
        endTime,
        members,
        studyTopics,
    });

    if (newStudyGroup) {
        res.status(201).json({
            group: newStudyGroup,
            msg: 'Study group created',
        });
    } else {
        res.status(400).json({
            error: 'Failed to create the study group',
        });
    }
});

// Get all study groups
const getStudyGroups = asyncHandler(async (req, res) => {
    const studyGroups = await StudyGroup.find({});
    res.json(studyGroups);
});

// Update a study group
const updateStudyGroup = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { groupName, location, startTime, endTime, members, studyTopics } =
        req.body;

    const studyGroup = await StudyGroup.findById(id);

    if (studyGroup) {
        studyGroup.groupName = groupName;
        studyGroup.location = location;
        studyGroup.startTime = startTime;
        studyGroup.endTime = endTime;
        studyGroup.members = members;
        studyGroup.studyTopics = studyTopics;

        const updatedGroup = await studyGroup.save();
        res.json(updatedGroup);
    } else {
        res.status(404).json({
            error: 'Study group not found',
        });
    }
});

// Delete a study group
const deleteStudyGroup = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const studyGroup = await StudyGroup.findById(id);

    if (studyGroup) {
        await studyGroup.remove();
        res.json({
            message: 'Study group removed',
        });
    } else {
        res.status(404).json({
            error: 'Study group not found',
        });
    }
});

export { createStudyGroup, getStudyGroups, updateStudyGroup, deleteStudyGroup };
