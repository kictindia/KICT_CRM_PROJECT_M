const moment = require('moment-timezone');
const Certificate = require('../models/certificateModel');
const Counter = require('../models/counterModel');

// Add a new Certificate
exports.addCertificate = async (req, res) => {
    // const month = moment().format('MM');
    const { StudentId, CourseId, FranchiseId, Marks, Percentage, Grade, Date } = req.body;
    const year = moment().format('YY');
    try {
        let counter = await Counter.findOne({ Title: `CER-${year}` });
        if (!counter) {
            counter = new Counter({ Title: `CER-${year}`, Count: 1 });
        } else {
            counter.Count += 1;
        }

        // Generate a new student ID using the counter
        const id = `KICT-${CourseId}-${year}-${StudentId}`;

        // Create a new certificate document
        const certificate = new Certificate({
            CertificateId: id,
            StudentId,
            CourseId,
            FranchiseId,
            Marks,
            Percentage,
            Grade,
            AdminVerified: false,
            Date
        });

        // Save the certificate to the database
        await certificate.save();
        await counter.save()
        res.status(201).json({ message: 'Certificate added successfully', certificate });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error adding certificate', error: err });
    }
};

// Get all Certificates
exports.getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find();
        res.status(200).json(certificates);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching certificates', error: err });
    }
};

// Get Certificate by CertificateId
exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ CertificateId: req.params.certificateId });
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(200).json(certificate);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching certificate', error: err });
    }
};

// Update Certificate by CertificateId
// exports.updateCertificate = async (req, res) => {
//     try {
//         const updatedCertificate = await Certificate.findOneAndUpdate(
//             { CertificateId: req.params.certificateId },
//             req.body,
//             { new: true, runValidators: true } 
//         );

//         if (!updatedCertificate) {
//             return res.status(404).json({ message: 'Certificate not found' });
//         }

//         res.status(200).json({ message: 'Certificate updated successfully', certificate: updatedCertificate });
//     } catch (err) {
//         res.status(500).json({ message: 'Error updating certificate', error: err });
//     }
// };

exports.updateCertificate = async (req, res) => {
    try {
        const { CertificateId, StudentId, CourseId, FranchiseId, Marks, Percentage, Grade, Date } = req.body;
        const updatedCertificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            { CertificateId, StudentId, CourseId, FranchiseId, Marks, Percentage, Grade, Date },
            { new: true } // Return updated certificate
        );
        if (!updatedCertificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(200).json(updatedCertificate);
    } catch (err) {
        res.status(500).json({ message: 'Error updating certificate', error: err });
    }
};


// Delete Certificate by CertificateId
// exports.deleteCertificate = async (req, res) => {
//     try {
//         const deletedCertificate = await Certificate.findOneAndDelete({ CertificateId: req.params.certificateId });

//         if (!deletedCertificate) {
//             return res.status(404).json({ message: 'Certificate not found' });
//         }

//         res.status(200).json({ message: 'Certificate deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Error deleting certificate', error: err });
//     }
// };

exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOneAndDelete({ CertificateId: req.params.id });
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error deleting certificate', error: err });
    }
};

// Controller for updating the AdminVerified status
exports.updateAdminVerifiedStatus = async (req, res) => {
    const { certificateId } = req.params;
    const { AdminVerified } = req.body;

    try {
        // Validate input
        if (typeof AdminVerified !== 'boolean') {
            return res.status(400).json({ message: 'AdminVerified must be a boolean' });
        }

        // Find the certificate and update the AdminVerified field
        const certificate = await Certificate.findOneAndUpdate(
            { CertificateId: certificateId },  // Find by CertificateId
            { AdminVerified: AdminVerified },  // Update the AdminVerified status
            { new: true }  // Return the updated certificate
        );

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Send the updated certificate as a response
        res.status(200).json(certificate);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating certificate', error: err });
    }
};
