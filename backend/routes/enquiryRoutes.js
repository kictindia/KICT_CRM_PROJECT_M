const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// Route to get all enquiries
router.get('/all', enquiryController.getAlldata);

// Route to get enquiry by EnquiryNo
router.get('/get/:id', enquiryController.getById);

// Route to add a new enquiry
router.post('/add', enquiryController.addEnquiry);

// Route to update an existing enquiry by EnquiryNo
router.put('/update/:id', enquiryController.updateEnquiry);

// Route to delete an enquiry by EnquiryNo
router.delete('/delete/:id', enquiryController.deleteEnquiry);

router.post('/add-student', enquiryController.addStudent);

module.exports = router;
