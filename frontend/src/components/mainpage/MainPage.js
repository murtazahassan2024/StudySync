import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';

const MainPage = () => {
    const [studyGroups, setStudyGroups] = useState([]);

    const deleteGroup = (id) => {
        axios
            .delete(`http://localhost:8001/api/studygroup/${id}`)
            .then(() => {
                // Update the state to remove the deleted group
                setStudyGroups((prevGroups) =>
                    prevGroups.filter((group) => group._id !== id)
                );
            })
            .catch((error) => {
                console.error('Error deleting study group:', error);
            });
    };

    useEffect(() => {
        axios
            .get('http://localhost:8001/api/studygroup/')
            .then((response) => {
                setStudyGroups(response.data);
            })
            .catch((error) => {
                console.error('Error fetching study groups:', error);
            });
    }, []);

    return (
        <>
            <div>
                <h1 style={{ textAlign: 'center' , }}>StudySync</h1>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                }}>
                {studyGroups.map((group) => (
                    <Card key={group._id}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {group.groupName}
                            </Typography>
                            <Typography>
                                Study Topic: {group.studyTopics.join(', ')}
                            </Typography>
                            <Typography>Location: {group.location}</Typography>
                            <Typography>
                                Start Time:{' '}
                                {new Date(group.startTime).toLocaleTimeString()}
                            </Typography>
                            <Typography>
                                End Time:{' '}
                                {new Date(group.endTime).toLocaleTimeString()}
                            </Typography>
                            <br></br>
                            <Button type="submit" fullWidth>
                                Join Group
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                onClick={() => deleteGroup(group._id)}
                            >
                                Delete Group
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default MainPage;
