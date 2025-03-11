const Student = require('../models/pendingStudentModel');
const Counter = require('../models/counterModel');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

// Add a new student
const addStudent = async (req, res) => {
    const month = moment().format('MM');
    const year = moment().format('YYYY');

    try {
        // Check and update the student counter for the current month and year
        let counter = await Counter.findOne({ Title: `TEMP-${year}-${month}` });
        console.log(counter);
        if (!counter) {
            counter = new Counter({ Title: `TEMP-${year}-${month}`, Count: 1 });
            console.log(counter);
        } else {
            counter.Count += 1;
        }

        // Generate a new student ID using the counter
        const id = `TEMP${year}${month}${counter.Count.toString().padStart(4, '0')}`;

        const {
            RegistrationNumber,
            AadhaarNumber,
            DateofAdmission,
            Branch,
            Name,
            Gender,
            DOB,
            FranchiseId,
            MobileNo,
            AlterMobileNo,
            Email,
            Address,
            Country,
            State,
            Pincode,
            Area,
            Qualification,
            GuardianDetails,
            Course,
            Verified,
        } = req.body;

        // console.log(req.body)

        // Get the image filename from the Multer uploaded file
        const image = req.file ? req.file.filename : null;

        // const courseIds = JSON.parse(Course).map(course => course.CourseId);
        // var courseFran = await CourseFranchise.find();
        // var filCou = courseFran.find(val => val.FranchiseId == FranchiseId);
        // console.log(filCou)
        // var feeData = []
        // for(var val of JSON.parse(Course)){
        //     // console.log(val)
        //     // console.log(filCou)
        //     var data = filCou.CourseData.find(value => value.CourseId == val.CourseId)
        //     var myCou = data.Price.Plans.find(va => va.PlanName == val.FeeMode)
        //     console.log(myCou)
        //     var objData ={
        //         StudentId: id,
        //         CourseId: val.CourseId,
        //         CourseName: val.CourseName,
        //         StudentName: Name,
        //         FranchiseId: FranchiseId,
        //         FranchiseName: Branch,
        //         TotalFee:myCou.TotalFee,
        //         PaidFee:0,
        //         Balance:myCou.TotalFee,
        //         FeeSlot:myCou.Installment,
        //         Installment:[]
        //     }
        //     console.log(objData);
        //     await new Fee(objData).save();
            
        // }
        // console.log("Extracted Course IDs: ", courseIds);
        // Create a new student document with the received data
        const newStudent = new Student({
            StudentID:id,
            RegistrationNumber,
            AadhaarNumber,
            DateofAdmission,
            FranchiseId,
            Branch,
            Name,
            Image: image,  // Save only the image name
            Gender,
            DOB,
            MobileNo,
            AlterMobileNo,
            Address,
            Country,
            State,
            Pincode,
            Area,
            Email,
            Qualification,
            GuardianDetails: JSON.parse(GuardianDetails),
            Course: JSON.parse(Course),
            Verified: Verified || false
        });

        // const newUser = new Login({ Id: id, Password: MobileNo, Role: 'Student' });
        const reg = await Counter.findOne({ Title: "REG" });
        reg.Count += 1;
        
        // Save the student record to the database
        await newStudent.save();
        await counter.save();
        await reg.save();
        // await newUser.save();

        res.status(201).json({ message: 'Student added successfully', student: newStudent });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding student', error: err.message });
    }
};

// Utility function to safely parse JSON
const tryParseJson = (data) => {
    try {
        return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
        return data;  // Return as is if parsing fails
    }
};

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
        await Counter.deleteMany({
            $or: [
                { Title: { $exists: false } },
                { Count: { $lte: 0 } },
                { Title: "", Count: { $exists: false } }
            ]
        });
        var allCount = await Counter.find();
        // console.log(allCount);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Get student by StudentID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({ StudentID: req.params.StudentID });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Update student
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findOne({ StudentID: req.params.StudentID });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update student data
        Object.assign(student, req.body);

        // Handle file uploads (if new files are provided)
        if (req.files && req.files.Image) {
            // Delete the old image file if it exists
            if (student.Image) {
                const oldFilePath = path.join(__dirname, '../uploads', student.Image);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Update the student's image
            student.Image = req.files.Image[0].filename;
        }

        await student.save();
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Delete student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({ StudentID: req.params.StudentID });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete associated image file if it exists
        if (student.Image) {
            const oldFilePath = path.join(__dirname, '../uploads', student.Image);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};
