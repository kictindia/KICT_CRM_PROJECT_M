const Student = require('../models/studentModel');
const PendingStudent = require('../models/pendingStudentModel');
const Counter = require('../models/counterModel');
const Login = require('../models/loginModel');
const CourseModel = require("../models/courseModel")
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const Fee = require('../models/feeModel');
const Batch = require('../models/batchModels');

const passwordGenerator = () => {
    var num = Math.floor(Math.random() * 9000) + 1000
    return "KICT" + num;
}

const feeSlotGenerator = (amountArray, Discount, Additional) => {
    var result = amountArray.map((value, index) => {
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + index);
        var destructure = String(currentDate.toLocaleDateString()).split("/");
        var formattedDate = `${destructure[0]}/${destructure[1]}/${destructure[2]}`;
        if (Number(Discount)) {
            // console.log(Math.round(Discount/amountArray.length));
            var sub = Math.round(Discount / amountArray.length);
            return {
                Amount: value - sub,
                Date: formattedDate,
                Status: "UnPaid",
                PaidAmount: 0
            }
        }
        if (Number(Additional)) {
            var plu = Math.round(Additional / amountArray.length);
            return {
                Amount: value + plu,
                Date: formattedDate,
                Status: "UnPaid",
                PaidAmount: 0
            }
        }
        return {
            Amount: value,
            Date: formattedDate,
            Status: "UnPaid",
            PaidAmount: 0
        }
    })
    return result;
}

// Add a new student
const addStudent = async (req, res) => {
    const month = moment().format('MM');
    const year = moment().format('YYYY');

    try {
        // Check and update the student counter for the current month and year
        let counter = await Counter.findOne({ Title: `STU-${year}-${month}` });
        if (!counter) {
            counter = new Counter({ Title: `STU-${year}-${month}`, Count: 1 });
        } else {
            counter.Count += 1;
        }

        // Generate a new student ID using the counter
        const id = `STU${year}${month}${counter.Count.toString().padStart(4, '0')}`;
        const Password = passwordGenerator();

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
        var courseFran = await CourseFranchise.find();
        var filCou = courseFran.find(val => val.FranchiseId == FranchiseId);
        console.log(filCou)
        var feeData = []
        for (var val of JSON.parse(Course)) {
            // console.log(val)
            // console.log(filCou)
            var data = filCou.CourseData.find(value => value.CourseId == val.CourseId)
            var myCou = data.Price.Plans.find(va => va.PlanName == val.FeeMode)
            console.log(myCou)
            var objData = {
                StudentId: id,
                CourseId: val.CourseId,
                CourseName: val.CourseName,
                StudentName: Name,
                FranchiseId: FranchiseId,
                FranchiseName: Branch,
                TotalFee: myCou.TotalFee,
                PaidFee: 0,
                Balance: myCou.TotalFee,
                FeeSlot: myCou.Installment,
                Installment: []
            }
            console.log(objData);
            await new Fee(objData).save();

        }
        // console.log("Extracted Course IDs: ", courseIds);
        // Create a new student document with the received data
        const newStudent = new Student({
            StudentID: id,
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
            Qualification,
            GuardianDetails: JSON.parse(GuardianDetails),
            Course: JSON.parse(Course),
            Verified: Verified || false
        });

        const newUser = new Login({ Id: id, Password: Password, Role: 'Student' });

        // Save the student record to the database
        // await newStudent.save();
        // await counter.save();
        // await newUser.save();

        res.status(201).json({ message: 'Student added successfully', student: newStudent });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding student', error: err.message });
    }
};

const addStudentFromPending = async (req, res) => {
    const month = moment().format('MM');
    const year = moment().format('YYYY');

    console.log(req.body)

    try {
        // Check and update the student counter for the current month and year
        let counter = await Counter.findOne({ Title: `STU-${year}` });
        if (!counter) {
            counter = new Counter({ Title: `STU-${year}`, Count: 1 });
        } else {
            counter.Count += 1;
        }

        // Generate a new student ID using the counter
        const id = `STU${year}${counter.Count}`;
        const Password = passwordGenerator();

        const {
            RegistrationNumber,
            AadhaarNumber,
            DateofAdmission,
            Branch,
            Name,
            Gender,
            DOB,
            Image,
            FranchiseId,
            MobileNo,
            AlterMobileNo,
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

        // console.log(req.body.Course)

        const image = req.file ? req.file.filename : null;
        for (var val of (Course)) {
            var course = await CourseModel.findOne({ CourseId: val.CourseId });
            var myCou = course.Price.Plans.find(va => va.PlanName == val.FeeMode)
            var objData = {
                StudentId: id,
                CourseId: val.CourseId,
                CourseName: val.CourseName,
                StudentName: Name,
                FranchiseId: FranchiseId,
                FranchiseName: Branch,
                TotalFee: myCou.TotalFee,
                PaidFee: 0,
                Balance: myCou.TotalFee,
                FeeSlot: feeSlotGenerator(myCou.Installment, val.Discount, val.Additional),
                Installment: []
            }
            const batch = await Batch.findOne({
                FranchiseId: FranchiseId,
                "Batch.Hour": val.Hour,
                "Batch.Slots.SlotTime": val.Slot,
            });
            const batchToUpdate = batch.Batch.find((b) => b.Hour === val.Hour);
            const slotToUpdate = batchToUpdate.Slots.find((s) => s.SlotTime === val.Slot);
            slotToUpdate.Students.push({
                StudentId: id,
                StudentName: Name,
            });
            // console.log(objData)
            await new Fee(objData).save();
            await batch.save();
        }

        const newStudent = new Student({
            StudentID: id,
            RegistrationNumber,
            AadhaarNumber,
            DateofAdmission,
            FranchiseId,
            Branch,
            Name,
            Image,  // Save only the image name
            Gender,
            DOB,
            MobileNo,
            AlterMobileNo,
            Address,
            Country,
            State,
            Pincode,
            Area,
            Qualification,
            GuardianDetails,
            Course,
            Verified: Verified || false
        });

        const newUser = new Login({ Id: id, Password: Password, Role: 'Student' });

        

        // Save the student record to the database
        await newStudent.save();
        await counter.save();
        await newUser.save();
        await PendingStudent.findByIdAndDelete(req.body._id);


        res.status(201).json({ message: 'Student added successfully', student: newStudent });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding student', error: err.message });
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

        var dataToAdd = req.body;
        console.log(dataToAdd)

        var formattedData = {
            ...dataToAdd,
            GuardianDetails: JSON.parse(dataToAdd.GuardianDetails),
            Course: JSON.parse(dataToAdd.Course)
        }
        // console.log(formattedData)

        // Update student data
        Object.assign(student, formattedData);
        // console.log(req.file)
        // console.log(req.file.Image)

        // Handle file uploads (if new files are provided)
        if (req.file) {
            // Delete the old image file if it exists
            if (student.Image) {
                const oldFilePath = path.join(__dirname, '../uploads', student.Image);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Update the student's image
            student.Image = req.file.filename;
        }

        // console.log(student)
        await student.save();
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const deleteStudentFromAllHoursAndSlots = async ({ franchiseId, studentId, studentName }) => {
    try {
        // Find the batch by FranchiseId (across all hours and slots)
        const batch = await Batch.findOne({
            FranchiseId: franchiseId,
        });

        if (!batch) {
            return { status: 404, message: "Batch not found" };
        }

        let studentRemoved = false;

        // Loop through all batches and all slots to remove the student
        batch.Batch.forEach(batchItem => {
            batchItem.Slots.forEach(slot => {
                const studentIndex = slot.Students.findIndex(
                    (student) => student.StudentId === studentId && student.StudentName === studentName
                );

                if (studentIndex !== -1) {
                    slot.Students.splice(studentIndex, 1); // Remove the student from the slot
                    studentRemoved = true;
                }
            });
        });

        if (!studentRemoved) {
            return { status: 404, message: "Student not found in any hour or slot" };
        }

        // Save the updated batch
        await batch.save();

        // Return success response
        return { status: 200, message: "Student removed from all hours and slots successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Error removing student from all hours and slots" };
    }
};

const deleteFeeByStudentId = async (studentId) => {
    try {
        const result = await Fee.deleteMany({ StudentId: studentId });
        if (result.deletedCount === 0) {
            console.log("No document found with the given StudentId.");
        } else {
            console.log(`Successfully deleted fee record with StudentId: ${studentId}`);
        }
    } catch (error) {
        console.error("Error deleting fee record:", error);
    }
};

const deleteFromLogin = async (studentId) => {
    try {
        const result = await Login.deleteMany({ Id: studentId });
        if (result.deletedCount === 0) {
            console.log("No document found with the given StudentId.");
        } else {
            console.log(`Successfully deleted login record with StudentId: ${studentId}`);
        }
    } catch (error) {
        console.log(error);
    }
}

// Delete student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOne({ StudentID: req.params.StudentID });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        deleteStudentFromAllHoursAndSlots({ franchiseId: student.FranchiseId, studentId: student.StudentID, studentName: student.Name })
        deleteFeeByStudentId(student.StudentID);
        deleteFromLogin(student.StudentID);
        await Student.findOneAndDelete({ StudentID: req.params.StudentID });

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

const getId = async (req, res) => {
    try {
        const student = await Counter.findOne({ Title: "REG" });
        if (!student) {
            return res.status(200).json({ Count: 0 });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addStudent,
    addStudentFromPending,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getId
};
