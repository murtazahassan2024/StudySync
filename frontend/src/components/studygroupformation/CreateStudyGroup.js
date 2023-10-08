import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const CreateStudyGroupForm = () => {
    const [groupName, setGroupName] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [members, setMembers] = useState([]);
    const [studyTopics, setStudyTopics] = useState('');
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    members,
                    studyTopics: studyTopicsArray,
                },
            );

            if (response.data && response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }

            setMessage('Study group successfully created!');
            setIsError(false);

            // Optionally navigate or do further actions if needed.
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
                        value={members.join(',')}
                        onChange={(e) => setMembers(e.target.value.split(','))}
                    />
                </Grid>

                {/* For members, you can use a multi-select component */}
                {/* For study topics, you can use a text input or select component */}
                {/* Remember to update the state and API request accordingly */}
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth>
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
