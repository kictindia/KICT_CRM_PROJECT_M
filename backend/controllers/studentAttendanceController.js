const StudentAttendance = require("../models/studentAttendance");

const addAttendance = async (req, res) => {
    const { Date, Course, Batch, Attendance } = req.body;

    try {
        // Ensure that Batch is an object with Hour and Name fields
        if (!Batch || !Batch.Hour || !Batch.Name) {
            return res.status(400).json({ message: 'Batch must include Hour and Name.' });
        }

        // Check if attendance already exists for this Date, Course, and Batch
        const existingRecord = await StudentAttendance.findOne({ Date, Course, 'Batch.Hour': Batch.Hour, 'Batch.Name': Batch.Name });

        if (existingRecord) {
            return res.status(400).json({ message: 'Attendance record for this Date, Course, and Batch already exists.' });
        }

        // Create the new attendance record
        const newAttendance = new StudentAttendance({
            Date,
            Course,
            Batch,
            Attendance
        });

        // Save the new attendance record
        await newAttendance.save();
        res.status(201).json(newAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all attendance records
const getAllAttendance = async (req, res) => {
    try {
        const attendances = await StudentAttendance.find();
        res.json(attendances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get attendance record by ID
const getAttendanceById = async (req, res) => {
    try {
        const attendance = await StudentAttendance.findById(req.params.id);
        if (!attendance) return res.status(404).json({ message: "Attendance record not found" });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update attendance record by ID
const updateAttendance = async (req, res) => {
    const { Date, Course, Batch, Attendance } = req.body;

    try {
        const updatedAttendance = await StudentAttendance.findByIdAndUpdate(
            req.params.id,
            { Date, Course, Batch, Attendance },
            { new: true, runValidators: true }
        );

        if (!updatedAttendance) return res.status(404).json({ message: "Attendance record not found" });
        res.json(updatedAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete attendance record by ID
const deleteAttendance = async (req, res) => {
    try {
        const deletedAttendance = await StudentAttendance.findByIdAndDelete(req.params.id);
        if (!deletedAttendance) return res.status(404).json({ message: "Attendance record not found" });
        res.json({ message: "Attendance record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
};
