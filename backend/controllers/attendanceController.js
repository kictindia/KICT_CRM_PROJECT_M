const moment = require('moment');
const Attendance = require('../models/attendanceModel');

// Add new attendance record
const addAttendance = async (req, res) => {
    try {
        // Format Date using moment to ensure consistency (you can choose any format, such as YYYY-MM-DD)
        const { Date, Time, Franchise, Role, Batch, Data } = req.body;
        const formattedDate = moment(Date, 'YYYY-MM-DD').format('YYYY-MM-DD'); // Using moment to format the date

        // Create new attendance entry
        const newAttendance = new Attendance({
            Date: formattedDate, // Use formatted date
            Time,
            Franchise,
            Role,
            Batch,
            Data,
        });

        // Save the attendance record
        await newAttendance.save();

        res.status(201).json({
            message: 'Attendance record added successfully',
            data: newAttendance
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

// Get all attendance records
const getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find();
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get attendance by Date and Franchise
const getAttendanceById = async (req, res) => {
    try {
        // Format Date using moment to ensure consistency in querying
        const { Date, Franchise } = req.params;
        const formattedDate = moment(Date, 'YYYY-MM-DD').format('YYYY-MM-DD');

        const attendance = await Attendance.findOne({ Date: formattedDate, Franchise });

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(200).json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update attendance record
const updateAttendance = async (req, res) => {
    const { Date, Franchise } = req.params; // Getting Date and Franchise as identifiers

    try {
        // Format Date using moment for consistent querying
        const formattedDate = moment(Date, 'YYYY-MM-DD').format('YYYY-MM-DD');

        // Find the attendance document by Date and Franchise
        const attendance = await Attendance.findOne({ Date: formattedDate, Franchise });

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        // Update attendance data
        const updatedAttendance = await Attendance.findOneAndUpdate(
            { Date: formattedDate, Franchise },
            req.body,
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: 'Attendance record updated successfully',
            data: updatedAttendance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete attendance record
const deleteAttendance = async (req, res) => {
    const { Date, Franchise } = req.params;

    try {
        // Format Date using moment for consistent querying
        const formattedDate = moment(Date, 'YYYY-MM-DD').format('YYYY-MM-DD');

        // Find and delete the attendance record by Date and Franchise
        const attendance = await Attendance.findOneAndDelete({ Date: formattedDate, Franchise });

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        res.status(204).send(); // Successfully deleted, no content to send back
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
};
