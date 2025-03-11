const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController'); 

// Add a new certificate
router.post('/add', certificateController.addCertificate);

// Get all certificates
router.get('/all', certificateController.getAllCertificates);

// Get certificate by CertificateId
router.get('/get/:certificateId', certificateController.getCertificateById);

// Update certificate by CertificateId
router.put('/update/:id', certificateController.updateCertificate);

// Delete certificate by CertificateId
router.delete('/delete/:id', certificateController.deleteCertificate);

// Route to update AdminVerified status
router.patch('/:certificateId/admin-verified', certificateController.updateAdminVerifiedStatus);

module.exports = router;
