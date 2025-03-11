const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const Admin = require("../models/adminModel");
const Counter = require("../models/counterModel");

// Add a new admin
const addAdmin = async (req, res) => {
    const month = moment().format('MM');
    const year = moment().format('YYYY');
    let id;

    try {
        const { Name, DOB, Email, MobileNo } = req.body;

        // Get the counter for the AdminID generation
        let counter = await Counter.findOne({ Title: `ADMIN-${year}-${month}` });

        if (!counter) {
            counter = new Counter({ Title: `ADMIN-${year}-${month}`, Count: 1 });
        } else {
            counter.Count += 1;
        }

        // Generate AdminID based on the counter
        id = `ADM${year}${month}${counter.Count.toString().padStart(4, '0')}`;

        // Create the admin object
        const newAdmin = new Admin({
            AdminID: id,
            Name,
            DOB,
            Email,
            MobileNo,
        });

        // Handle file uploads (for image)
        if (req.files) {
            newAdmin.Image = req.file.filename;
        }

        // Save the admin data and the updated counter
        await counter.save();
        await newAdmin.save();

        // Respond with the newly added admin
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get admin by AdminID
const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findOne({ AdminID: req.params.AdminID });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update admin data
const updateAdmin = async (req, res) => {
    const { AdminID } = req.params; // Get the AdminID from the route parameter

    try {
        // Find the admin document by AdminID
        const admin = await Admin.findOne({ AdminID: AdminID });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Initialize an object to store document filenames if files are uploaded
        const documents = {};

        // Check if files are uploaded and handle the document fields accordingly
        if (req.files) {
            if (req.files.Image) {
                documents.Image = req.files.Image[0].filename;
            }
        }

        // Prepare the updated admin data
        const updatedAdminData = {
            ...req.body, // Spread the new data from the request body
        };

        // If documents were uploaded, update them
        if (Object.keys(documents).length > 0) {
            updatedAdminData.Image = documents.Image;
        }

        // Update the admin document
        const updatedAdmin = await Admin.findOneAndUpdate(
            { AdminID: AdminID },
            updatedAdminData,
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: 'Admin data updated successfully',
            updatedAdmin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete admin
const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findOneAndDelete({ AdminID: req.params.AdminID });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Delete files associated with the admin
        if (admin.Image) {
            fs.unlinkSync(path.join(__dirname, '../uploads', admin.Image));
        }

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

module.exports = {
    addAdmin,
    updateAdmin,
    getAllAdmins,
    getAdminById,
    deleteAdmin,
};
