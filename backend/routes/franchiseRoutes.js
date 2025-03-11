const express = require('express');
const router = express.Router();
const upload = require('./../config/multer');
const franchiseController = require('../controllers/franchiseController');

// Get all franchises
router.get('/all', franchiseController.getAllFranchises);

// Get franchise by FranchiseID
router.get('/get/:FranchiseID', franchiseController.getFranchiseById);

// Add a new franchise
router.post('/add', upload.single('image'), franchiseController.addFranchise);

// Update franchise details
router.put('/update/:FranchiseID', upload.single('UPICode'), franchiseController.updateFranchise);

// Delete franchise
router.delete('/delete/:FranchiseID', franchiseController.deleteFranchise);

module.exports = router;
