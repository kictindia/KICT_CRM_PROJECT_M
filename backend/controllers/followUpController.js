const moment = require('moment-timezone');
const FollowUp = require('../models/followupModel');
const Enquiry = require('../models/enquiryModel');

// Add a new follow-up
exports.addFollowUp = async (req, res) => {
    try {
        const { EnquiryNo, Name, FranchiseId, FranchiseName, MobileNo, AMobileNo, Course, Message } = req.body;

        const newFollowUp = new FollowUp({
            EnquiryNo,
            Name,
            FranchiseName,
            FranchiseId,
            MobileNo,
            AMobileNo,
            Course,
            Date: moment().tz('Asia/Kolkata').format('DD-MM-YYYY'),
            Time: moment().tz('Asia/Kolkata').format('HH:mm:ss'),
            Message,
        });
        

        const enquiry = await Enquiry.findOne({ EnquiryNo });

        if (!enquiry) {
            res.status(404).json({ message: 'Enquiry Not Found' });
            return;
        }

        const lastCount = enquiry.Followup;
        enquiry.Followup = lastCount + 1;
        newFollowUp.Followup = lastCount + 1;

        await enquiry.save();
        await newFollowUp.save();
        res.status(201).json({ message: 'Follow-up added successfully', followUp: newFollowUp });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding follow-up', error });
    }
};

// Get a single follow-up by _id
exports.getFollowUp = async (req, res) => {
    try {
        const followUp = await FollowUp.findById(req.params.id);
        if (!followUp) {
            return res.status(404).json({ message: 'Follow-up not found' });
        }
        res.status(200).json(followUp);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching follow-up', error });
    }
};

// Get all follow-ups
exports.getAllFollowUps = async (req, res) => {
    try {
        const followUps = await FollowUp.find();
        res.status(200).json(followUps);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching follow-ups', error });
    }
};
// Get all follow-ups by ID
exports.getAllFollowUpsID = async (req, res) => {
    const Id = req.params.id;
    try {
        const followUps = await FollowUp.find({ EnquiryNo: Id });
        res.status(200).json(followUps);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching follow-ups', error });
    }
};

// Update a follow-up by _id
exports.updateFollowUp = async (req, res) => {
    try {
        const updatedFollowUp = await FollowUp.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // return the updated document
        );
        if (!updatedFollowUp) {
            return res.status(404).json({ message: 'Follow-up not found' });
        }
        res.status(200).json({ message: 'Follow-up updated successfully', followUp: updatedFollowUp });
    } catch (error) {
        res.status(500).json({ message: 'Error updating follow-up', error });
    }
};

// Delete a follow-up by _id
exports.deleteFollowUp = async (req, res) => {
    try {
        // Delete using EnquiryNo
        const deletedFollowUp = await FollowUp.findByIdAndDelete(req.params.id );
        
        if (!deletedFollowUp) {
            return res.status(404).json({ message: 'Follow-up with this EnquiryNo not found' });
        }

        res.status(200).json({ message: 'Follow-up deleted successfully' });
    } catch (error) {
        console.error('Error deleting follow-up:', error);
        res.status(500).json({ message: 'Error deleting follow-up', error });
    }
};

