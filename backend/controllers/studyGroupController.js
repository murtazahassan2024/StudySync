import asyncHandler from 'express-async-handler';
import StudyGroup from '../models/studyGroupModel.js';
import sendEmail from '../emailService.js';

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


const getStudyGroup = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  // Use the ID to find a single study group
  const studyGroup = await StudyGroup.findById(id);
  res.json(studyGroup);
});


// Update a study group
// Update a study group
const updateStudyGroup = asyncHandler(async (req, res) => {
    
    const { id } = req.params;
    const { groupName, location, startTime, endTime, members, studyTopics } = req.body;
    const studyGroup = await StudyGroup.findById(id);

    if (studyGroup) {
        studyGroup.groupName = groupName;
        studyGroup.location = location;
        studyGroup.startTime = startTime;
        studyGroup.endTime = endTime;
        studyGroup.members = members;
        studyGroup.studyTopics = studyTopics;

        const updatedGroup = await studyGroup.save();

            
        // Send email to all members after successful update
        try {

            // The email sending should be inside the try block
            await sendEmail({
                to: members, // Ensure this is an array of email strings
                subject: `Update: ${groupName} Study Group Details Changed`,
                text: `The study group ${groupName} has been updated. Please check the platform for the new details.`,
                // Optionally, you can also use an HTML template
            });
            console.log('Emails sent to group members.');

           res.json(updatedGroup); // Send the response after emails are sent
        } catch (error) {
            console.error('Failed to send emails:', error);
            // You might decide to still send a response if the email fails
            // Or handle the error differently depending on requirements
            res.status(500).json({
                error: 'Email sending failed',
                detail: error.message
            });
        }
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

const updateStudyGroupMembers = async (req, res) => {
  // Destructure the `id` from `req.params` or `req.body` as required.
  const { id } = req.params; // or `const { id } = req.body;` if the ID is sent in the body.
  const { members } = req.body;

  try {
    // You need to pass the `id` you just destructured to `findByIdAndUpdate`.
    const updatedGroup = await StudyGroup.findByIdAndUpdate(
      id,
      { $set: { members: members } },
      { new: true }
    );
 

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Study group not found.' });
    }

    res.status(200).json({
      message: 'Study group updated successfully.',
      studyGroup: updatedGroup
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating study group.', error: error.message });
  }
};






export { createStudyGroup, getStudyGroups, updateStudyGroup, deleteStudyGroup, getStudyGroup,updateStudyGroupMembers};
