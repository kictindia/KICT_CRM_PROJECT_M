const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Route to add a new course
router.post('/add', courseController.addCourse);

// Route to get all courses
router.get('/all', courseController.getAllCourses);

// Route to get a course by CourseId
router.get('/get/:CourseId', courseController.getCourseById);

// Route to update a course by CourseId
router.put('/update/:CourseId', courseController.updateCourse);

// Route to delete a course by CourseId
router.delete('/delete/:CourseId', courseController.deleteCourse);

module.exports = router;
