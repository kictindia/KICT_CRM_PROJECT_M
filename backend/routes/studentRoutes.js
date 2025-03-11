const express = require('express');
const router = express.Router();
const upload = require('./../config/multer');
const studentController = require('../controllers/studentController');

// Route to add a student with image upload
router.post('/add', upload.single('image'), studentController.addStudent);

router.post('/add-from-pending', studentController.addStudentFromPending);

// Get all students
router.get('/all', studentController.getAllStudents);
router.get('/id', studentController.getId);

// Get student by StudentID
router.get('/get/:StudentID', studentController.getStudentById);

// Update student by StudentID
router.put('/update/:StudentID', upload.single('image'), studentController.updateStudent);

// Delete student by StudentID
router.delete('/delete/:StudentID', studentController.deleteStudent);

module.exports = router;
