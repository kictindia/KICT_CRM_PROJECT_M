const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUpController');

// Route to add a new follow-up
router.post('/add', followUpController.addFollowUp);

// Route to get a follow-up by _id
router.get('/get/:id', followUpController.getFollowUp);

router.get('/getById/:id', followUpController.getAllFollowUpsID);

// Route to get all follow-ups
router.get('/all', followUpController.getAllFollowUps);

// Route to update a follow-up by _id
router.put('/update/:id', followUpController.updateFollowUp);

// Route to delete a follow-up by _id
router.delete('/delete/:id', followUpController.deleteFollowUp);

module.exports = router;
