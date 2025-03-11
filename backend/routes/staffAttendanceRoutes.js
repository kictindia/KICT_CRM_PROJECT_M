const express = require("express");
const router = express.Router();
const {
    addAttendance,
    getAllAttendance,
    updateAttendance,
    getAttendanceById,
    deleteAttendance,
    getAttendanceByFranchiseAndDate,
    getTeacherAttendanceByMonth
} = require("../controllers/staffAttendanceController"); // Make sure the path is correct for your project structure

// Get attendance by FranchiseName and Date
router.post('/get/franchise-date', getAttendanceByFranchiseAndDate);

// Add new attendance record (POST)
router.post("/add", addAttendance);

// Route to get teacher attendance by TeacherId and Month
router.post("/teacher-attendance", getTeacherAttendanceByMonth);

// Get all attendance records (GET)
router.get("/all", getAllAttendance);

// Get attendance record by ID (GET)
router.get("/get/:id", getAttendanceById);

// Update attendance record by ID (PUT)
router.put("/update", updateAttendance);

// Delete attendance record by ID (DELETE)
router.delete("/delete/:id", deleteAttendance);

module.exports = router;
