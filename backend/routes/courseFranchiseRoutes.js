const express = require('express');
const router = express.Router();
const courseFranchiseController = require('../controllers/courseFranchiseController');

// Route to get all franchise data
router.get('/all', courseFranchiseController.getAllCourseFranchises);

// Route to get franchise data by FranchiseId
router.get('/get/:FranchiseId', courseFranchiseController.getCourseFranchiseById);

// Route to add a new franchise with courses
router.post('/add', courseFranchiseController.addCourseFranchise);

router.put("/update/:fran/:CourseId", courseFranchiseController.updateCourseFee);

// Route to update franchise and course data
router.put('/update/:CourseId', courseFranchiseController.updateCourseFranchise);

// Route to delete franchise data
router.delete('/delete/:FranchiseId', courseFranchiseController.deleteCourseFranchise);

module.exports = router;
