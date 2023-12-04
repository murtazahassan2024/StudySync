import express from 'express';

import {
    createStudyGroup,
    getStudyGroups,
    updateStudyGroup,
    deleteStudyGroup,
    getStudyGroup,
    updateStudyGroupMembers,
    getStudyGroupName

} from '../controllers/studyGroupController.js';


const studyGroupRoutes = express.Router();

// API Endpoints for Study Groups
studyGroupRoutes.post('/', createStudyGroup);
studyGroupRoutes.get('/', getStudyGroups);
studyGroupRoutes.put('/:id', updateStudyGroup);
studyGroupRoutes.delete('/:id', deleteStudyGroup);
studyGroupRoutes.get('/:id', getStudyGroup);
studyGroupRoutes.post('/:id', updateStudyGroupMembers);
studyGroupRoutes.get('/studyGroupName/:id', getStudyGroupName);

export default studyGroupRoutes;
