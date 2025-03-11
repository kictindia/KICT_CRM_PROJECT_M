const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');

// Route to add a new fee record
router.post('/add', feeController.addFee);

// Route to get all fee records
router.get('/all', feeController.getAllFees);

// Route to add installments to a specific student's fee
router.put('/add-installment/:studentId/:courseId', feeController.addInstallment);

// Route to get fee record by StudentId and CourseId
router.get('/get/:StudentId/:CourseId', feeController.getFeeByStudentAndCourse);

// Route to update fee record by StudentId and CourseId
router.put('/update/:StudentId/:CourseId', feeController.updateFee);

// Route to delete fee record by StudentId and CourseId
router.delete('/delete/:StudentId/:CourseId', feeController.deleteFee);

module.exports = router;
