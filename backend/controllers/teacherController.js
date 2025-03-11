const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const Teacher = require("../models/teacherModel");
const Counter = require("../models/counterModel");
const Login = require("../models/loginModel");

const passwordGenerator = () => {
    var num = Math.floor(Math.random() * 9000) + 1000
    return "KICT" + num;
}

// Bulk upload teacher data
const bulkUploadTeacherData = async (req, res) => {
    try {
        // Extract the uploaded teacher data from the request body
        const teacherData = req.body;  // Array of teacher objects

        // Validate the incoming data format
        if (!Array.isArray(teacherData) || teacherData.length === 0) {
            return res.status(400).json({ message: 'Invalid data format or empty data.' });
        }

        // Validate each teacher entry
        teacherData.forEach(teacher => {
            if (!teacher.Email) {
                throw new Error('Missing required fields in teacher data.');
            }
        });

        // Insert multiple teacher records in one go
        const savedTeachers = await Teacher.insertMany(teacherData);

        // Respond with success message and data
        res.status(200).json({
            message: 'Teacher data uploaded successfully!',
            data: savedTeachers
        });
    } catch (error) {
        console.error('Error uploading teacher data:', error);
        res.status(500).json({
            message: 'Error uploading teacher data.',
            error: error.message
        });
    }
};

// Add a new teacher
const addTeacher = async (req, res) => {
    const month = moment().format('MM');
    const year = moment().format('YYYY');
    let id;

    try {
        const {
            Name, Gender, DOB, DOJ, Email, MobileNo, Address, Roles, FranchiseName, Salary, FranchiseId
        } = req.body;

        console.log(req.body)

        // Get the counter for the TeacherID generation
        let counter = await Counter.findOne({ Title: `TEACHER-${year}-${month}` });

        if (!counter) {
            counter = new Counter({ Title: `TEACHER-${year}-${month}`, Count: 1 });
        } else {
            counter.Count += 1;
        }

        // Generate TeacherID based on the counter
        id = `TCH${year}${month}${counter.Count.toString().padStart(4, '0')}`;

        console.log(req.file)
        // Create the teacher object
        const newTeacher = new Teacher({
            TeacherID: id,
            Name,
            Gender,
            DOB,
            DOJ,
            Email,
            MobileNo,
            Address,
            Role: JSON.parse(Roles),
            FranchiseName,
            Salary,
            FranchiseId
        });


        // Handle file uploads
        if (req.file) {
            newTeacher.Image = req.file.filename;
        }

        const Password = passwordGenerator();

        const newUser = new Login({ Id: id, Password: Password, Role: 'Teacher' });

        // Save the teacher data and the updated counter
        await counter.save();
        await newTeacher.save();
        await newUser.save();

        // Respond with the newly added teacher
        res.status(201).json(newTeacher);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

// Get all teachers
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get teacher by TeacherID
const getTeacherById = async (req, res) => {
    try {
        console.log(req.params.TeacherID)
        // Find the teacher based on the TeacherID from the request params
        const teacher = await Teacher.findOne({ TeacherID: req.params.TeacherID });
        const teachers = await Teacher.find();
        
        console.log(teachers)
        // If no teacher is found, return a 404 error
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // If the teacher is found, send the teacher data as a response with status 200
        res.status(200).json(teacher);
    } catch (error) {
        // If there is any error in the process, send a 400 status with the error message
        res.status(400).json({ message: error.message });
    }
};


// Update teacher data
const updateTeacher = async (req, res) => {
    const { TeacherID } = req.params; // Get the TeacherID from the route parameter

    try {
        const teacher = await Teacher.findOne({ TeacherID: TeacherID });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const documents = {};
        // Handle image file upload
        if (req.files) {
            if (req.files.Image) {
                documents.Image = req.files.Image[0].filename;
            }
        }

        // Update teacher data (including file if exists)
        const updatedTeacherData = {
            ...req.body,
            Image: documents.Image || teacher.Image // Only update the image if it exists
        };

        const updatedTeacher = await Teacher.findOneAndUpdate(
            { TeacherID: TeacherID },
            updatedTeacherData,
            { new: true }
        );

        res.status(200).json({
            message: 'Teacher data updated successfully',
            updatedTeacher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete teacher
const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findOneAndDelete({ TeacherID: req.params.TeacherID });
        const teacherLogin = await Login.findOneAndDelete({Id:req.params.TeacherID});

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Delete files associated with the teacher
        if (teacher.Image) {
            fs.unlinkSync(path.join(__dirname, '../uploads', teacher.Image));
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

module.exports = {
    addTeacher,
    updateTeacher,
    getAllTeachers,
    getTeacherById,
    bulkUploadTeacherData,
    deleteTeacher,
};
