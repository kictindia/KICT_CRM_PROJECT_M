const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Route to get all attendance records
router.get('/all', attendanceController.getAllAttendance);

// Route to get attendance by Date and Franchise
router.get('/get/:Date/:Franchise', attendanceController.getAttendanceById);

// Route to add a new attendance record
router.post('/add', attendanceController.addAttendance);

// Route to update an attendance record
router.put('/update/:Date/:Franchise', attendanceController.updateAttendance);

// Route to delete an attendance record
router.delete('/delete/:Date/:Franchise', attendanceController.deleteAttendance);

module.exports = router;
