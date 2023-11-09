import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { getUserEmail } from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/login/Login.js'; 
import {exportMembers} from '/Users/murtazahassan/Desktop/StudySync/frontend/src/components/studygroupformation/CreateStudyGroup.js';

const MainPage = () => {
    const [studyGroups, setStudyGroups] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAlpha, setSortAlpha] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);

    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        const value = e.target.value;
        console.log('Search Term:', value);
        setSearchTerm(value);
    };
    const handleDeleteConfirmation = (id) => {
        setGroupToDelete(id);
        setConfirmDeleteOpen(true);
    };
    const handleConfirmDeleteClose = () => {
        setConfirmDeleteOpen(false);
        setGroupToDelete(null);
    };







const joinGroup = async (groupId) => {
  const userEmail = getUserEmail();

  if (userEmail) {
    try {
      // Get the current group details
      const groupResponse = await axios.get(`http://localhost:8001/api/studygroup/${groupId}`);
      let groupMembers = groupResponse.data.members;

      // Check if the userEmail is already in groupMembers to avoid duplicates
      if (!groupMembers.includes(userEmail)) {
        groupMembers.push(userEmail); // Add the userEmail to the array

        // Now, send the updated array back to the server to update the group
        const updateResponse = await axios.post(`http://localhost:8001/api/studygroup/${groupId}`, { members: groupMembers });

        // If the update is successful, update the local state to reflect this
        if (updateResponse.status === 200) {
          setStudyGroups(prevGroups => prevGroups.map(group => {
            if (group._id === groupId) {
              // This is the group that was just joined, update its members
              return {...group, members: groupMembers};
            }
            return group; // For all other groups, return them as they were
          }));
        }
      } else {
        // User is already in the group, handle this case appropriately
        console.log('User is already a member of the group.');
      }
    } catch (error) {
      console.error('Error joining study group:', error);
      // Handle the error
    }
  } else {
    console.error('No email found for user');
    // Handle the case when email is not available
  }
};





    const filteredGroups = studyGroups.slice().sort((a, b) => {
            if (sortAlpha === true)
                return a.groupName.localeCompare(b.groupName);
            if (sortAlpha === false)
                return b.groupName.localeCompare(a.groupName);
            return 0;
        }).filter(
            (group) =>
                group.groupName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                group.studyTopics.some((topic) =>
                    topic.toLowerCase().includes(searchTerm.toLowerCase()),
                ),
);

    const toggleSort = () => {
        if (sortAlpha === null) setSortAlpha(false);
        else setSortAlpha(!sortAlpha);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [currentEditingGroupId, setCurrentEditingGroupId] = useState(null);

    const handleEdit = (group) => {
        setGroupDetails({
            groupName: group.groupName,
            studyTopics: group.studyTopics.join(', '),
            location: group.location,
            members: group.members,
            startTime: new Date(group.startTime),
            endTime: new Date(group.endTime),
        });
        setCurrentEditingGroupId(group._id);
        handleClickOpen();
    };

    const [groupDetails, setGroupDetails] = useState({
        groupName: '',
        studyTopics: '',
        location: '',
        startTime: '',
        endTime: '',
        members:[exportMembers],
    });

    const updateGroup = (id) => {
        console.log('updateGroup called with ID:', id); // New log
        console.log("gi")
        axios
            .put(`http://localhost:8001/api/studygroup/${id}`, groupDetails)
            .then((response) => {
                console.log('Group updated successfully:', response.data);
                
           

                // If the response has an error field (group wasn't found), handle it:

                console.log('This was the response: ', response);

                if (response.data.error) {
                    console.error('Error:', response.data.error);
                    return; // Exit the function here
                }

                // If the response has a message field (group was found but no fields changed), handle it:
                if (response.data.message) {
                    console.warn(response.data.message);
                }

                const updatedGroupData = response.data;
                setStudyGroups((prevGroups) =>
                    prevGroups.map((group) =>
                        group._id === id ? updatedGroupData : group,
                    ),
                );

                handleClose();
            })
            .catch((error) => {
                console.error('Error updating study group:', error);
            });
        
    };

    const deleteGroup = () => {
        if (groupToDelete) {
            axios
                .delete(`http://localhost:8001/api/studygroup/${groupToDelete}`)
                .then(() => {
                    setStudyGroups((prevGroups) =>
                        prevGroups.filter(
                            (group) => group._id !== groupToDelete,
                        ),
                    );
                    handleConfirmDeleteClose();
                })
                .catch((error) => {
                    console.error('Error deleting study group:', error);
                });
        }
    };

    useEffect(() => {
        axios
            .get('http://localhost:8001/api/studygroup/')
            .then((response) => {
                setStudyGroups(response.data);
            })
            .catch((error) => {
                console.error('Error fetching study groups:', error.message);
            });
    }, []);

    return (
        <>
            <div>
                <h1 style={{ textAlign: 'center', fontSize: '30pxscript' }}>
                    StudySync
                </h1>
            </div>

            <div>
                <TextField
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by group name or study topic..."
                    style={{ margin: '20px 20px 20px 20px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <SortByAlphaIcon
                                    onClick={toggleSort}
                                    style={{ cursor: 'pointer' }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    onClick={() => navigate('/create-study-group')}
                    variant="contained"
                    color="primary"
                    style={{ margin: '25px 0' }}>
                    Create Study Group
                </Button>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                }}>
                {filteredGroups.map((group) => (
                    <Card key={group._id} style={{ marginBottom: '15px' }}>
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
                            <Button type="submit" fullWidth onClick={() => joinGroup(group._id)}>
  Join Group
</Button>

                            <Button
                                type="submit"
                                fullWidth
                                onClick={() =>
                                    handleDeleteConfirmation(group._id)
                                }>
                                Delete Group
                            </Button>

                            <Button fullWidth onClick={() => handleEdit(group)}>
                                Edit Group Details
                            </Button>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                                <DialogContent>
                                    <DialogContentText>
                                        <h3>Group Name</h3>
                                        <TextField
                                            style={{ width: '300px' }}
                                            value={groupDetails.groupName}
                                            onChange={(e) =>
                                                setGroupDetails({
                                                    ...groupDetails,
                                                    groupName: e.target.value,
                                                })
                                            }></TextField>
                                        <h3>Study Topics</h3>
                                        <TextField
                                            style={{ width: '300px' }}
                                            value={groupDetails.studyTopics}
                                            onChange={(e) =>
                                                setGroupDetails({
                                                    ...groupDetails,
                                                    studyTopics: e.target.value,
                                                })
                                            }></TextField>
                                        <h3>Location</h3>
                                        <TextField
                                            value={groupDetails.location}
                                            onChange={(e) =>
                                                setGroupDetails({
                                                    ...groupDetails,
                                                    location: e.target.value,
                                                })
                                            }></TextField>
                                        <h3>Start Time</h3>
                                        <TextField
                                            value={groupDetails.startTime}
                                            onChange={(e) =>
                                                setGroupDetails({
                                                    ...groupDetails,
                                                    startTime: e.target.value,
                                                })
                                            }></TextField>
                                        <h3>End Time</h3>
                                        <TextField
                                            value={groupDetails.endTime}
                                            onChange={(e) =>
                                                setGroupDetails({
                                                    ...groupDetails,
                                                    endTime: e.target.value,
                                                })
                                            }></TextField>
                                        <h3>Members</h3>
                                        <TextField
                                            style={{ width: '300px' }}
                                            value={groupDetails.members?.join(
                                                ', ',
                                            )} // Display as comma-separated values
                                            onChange={(e) =>
                                                setGroupDetails({
                                                    ...groupDetails,
                                                    members: e.target.value
                                                        .split(',')
                                                        .map((item) =>
                                                            item.trim(),
                                                        ), // Convert back to an array
                                                })
                                            }
                                            placeholder="ID1, ID2, ID3..."></TextField>
                                    </DialogContentText>
                                    <DialogActions>
                                        <Button onClick={handleClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                updateGroup(
                                                    currentEditingGroupId,
                                                );
                                            }}
                                            autoFocus>
                                            Confirm
                                        </Button>
                                    </DialogActions>
                                </DialogContent>
                            </Dialog>
                            <Dialog
                                open={confirmDeleteOpen}
                                onClose={handleConfirmDeleteClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                                <DialogContent>
                                    <DialogContentText>
                                        Are you sure you want to delete this
                                        study group?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleConfirmDeleteClose}>
                                        No
                                    </Button>
                                    <Button onClick={deleteGroup} autoFocus>
                                        Yes, Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default MainPage;
