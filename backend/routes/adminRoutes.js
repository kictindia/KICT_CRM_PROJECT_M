const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Route for getting all admins
router.get('/all', adminController.getAllAdmins);

// Route for getting an admin by AdminID
router.get('/get/:AdminID', adminController.getAdminById);

// Route for adding a new admin
router.post('/add', upload.single('Image'), adminController.addAdmin);

// Route for updating admin data
router.put('/update/:AdminID', upload.single('Image'), adminController.updateAdmin);

// Route for deleting an admin
router.delete('/delete/:AdminID', adminController.deleteAdmin);

module.exports = router;
