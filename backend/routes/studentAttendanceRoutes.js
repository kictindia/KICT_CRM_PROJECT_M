const express = require("express");
const router = express.Router();
const {
    addAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
} = require("../controllers/studentAttendanceController"); // Ensure this path is correct based on your project structure

// Add new attendance record (POST)
router.post("/add", addAttendance);

// Get all attendance records (GET)
router.get("/all", getAllAttendance);

// Get attendance record by ID (GET)
router.get("/get/:id", getAttendanceById);

// Update attendance record by ID (PUT)
router.put("/update/:id", updateAttendance);

// Delete attendance record by ID (DELETE)
router.delete("/delete/:id", deleteAttendance);

module.exports = router;
