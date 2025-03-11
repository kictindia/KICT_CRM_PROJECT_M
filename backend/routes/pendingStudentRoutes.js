const express = require('express');
const router = express.Router();
const upload = require('./../config/multer');
const studentController = require('../controllers/pendingStudentController');

// Route to add a student with image upload
router.post('/add', upload.single('image'), studentController.addStudent);

// Get all students
router.get('/all', studentController.getAllStudents);

// Get student by StudentID
router.get('/get/:StudentID', studentController.getStudentById);

// Update student by StudentID
router.put('/update/:StudentID', studentController.updateStudent);

// Delete student by StudentID
router.delete('/delete/:StudentID', studentController.deleteStudent);

module.exports = router;
