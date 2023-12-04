import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/Users/murtazahassan/Desktop/StudySync/frontend/src/context/AuthContext.js';
import { getUserEmail } from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/login/Login.js'; 

export const exportMembers = (updatedMembers) => {
    return updatedMembers
};


const CreateStudyGroupForm = () => {
    const { email } = useAuth();
    const [groupName, setGroupName] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [members, setMembers] = useState([]);
    const [studyTopics, setStudyTopics] = useState('');
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    
    
    const handleMemberChange = (updatedMembers) => {
        setMembers(updatedMembers);  // Update the state with the new members
        exportMembers(updatedMembers); // Call exportMembers with the updated members list
};

const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = getUserEmail();
    let updatedMembers = members;
    if (userEmail) {
        updatedMembers =userEmail
    }
    
    // Split the studyTopics string into an array
    const studyTopicsArray = studyTopics
        .split(',')
        .map((topic) => topic.trim());

    try {
        const response = await axios.post(
            'http://localhost:8001/api/studygroup/',
            {
                groupName,
                location,
                startTime,
                endTime,
                members: updatedMembers,
                studyTopics: studyTopicsArray,
            },
        );

        if (response.data && response.data.token) {
            localStorage.setItem('userToken', response.data.token);
        }

        setMessage('Study group successfully created!');
        setIsError(false);
        navigate('/');
        

    } catch (error) {
            console.error('Error creating study group:', error);
            setMessage('Error creating study group. Please try again.');
            setIsError(true);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Create Study Group</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Group Name"
                        variant="outlined"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Study Topics (comma-separated)"
                        variant="outlined"
                        value={studyTopics}
                        onChange={(e) => setStudyTopics(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Location"
                        variant="outlined"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Start Time"
                        variant="outlined"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="End Time"
                        variant="outlined"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Members (comma-separated emails)"
                        variant="outlined"
                        value={members} // 'members' should now be a string, not an array
                        onChange={(e) => setMembers(e.target.value)}
                        style={{ display: 'none' }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                value={members.length > 0 ? members.join(',') : ''}
                onClick={() => {
                    const updatedMembers = [...members, email]; // Create the updated members list
                    setMembers(updatedMembers);                // Update the members state
                    handleMemberChange(members); 
                }}            >
                Create Study Group
                
            </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {message && (
                    <Typography color={isError ? 'error' : 'primary'}>
                        {message}
                    </Typography>
                )}
            </Grid>
        </form>
    );
};



export default CreateStudyGroupForm;
