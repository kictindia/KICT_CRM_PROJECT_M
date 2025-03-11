const moment = require('moment-timezone');
const Enquiry = require('../models/enquiryModel');
const FollowUp = require('../models/followupModel');
const CourseModel = require('../models/courseModel');
const Counter = require('../models/counterModel');
const Student = require("../models/studentModel");
const Login = require("../models/loginModel");
const Fee = require("../models/feeModel");

// Add a new enquiry
exports.addEnquiry = async (req, res) => {
    const { Hour, Name, FranchiseId, FranchiseName, CourseId, Course, FeeMode, MobileNo, AMobileNo, Qualification, KnowAbout, Address, PinCode, BatchTime, JoinDate, Remark, Status } = req.body;

    const month = moment().format('MM');
    const year = moment().format('YYYY');
    let id;

    try {
        let counter = await Counter.findOne({ Title: `REG-${year}` });

        if (!counter) {
            counter = new Counter({ Title: `REG-${year}`, Count: 1 });
        } else {
            counter.Count += 1;
        }
        id = `REG${year}${counter.Count}`;

        const enquiry = new Enquiry({
            EnquiryNo: id,
            Name,
            FranchiseId,
            FranchiseName,
            Course,
            CourseId,
            MobileNo,
            AMobileNo,
            Qualification,
            KnowAbout,
            Address,
            PinCode,
            Hour,
            BatchTime,
            FeeMode,
            JoinDate,
            Remark,
            Followup: 0,
            Status: Status || "Open",
            Date: moment().tz("Asia/Kolkata").format('YYYY-MM-DD'),
            Time: moment().tz("Asia/Kolkata").format('HH:mm:ss')
        });

        const saveData = await enquiry.save();
        counter.save(); // Save the counter to update it
        res.status(201).json({ message: "Enquiry Added Successfully.", saveData });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

// Get all enquiries
exports.getAlldata = async (req, res) => {
    try {
        const allData = await Enquiry.find();
        res.status(200).json(allData);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

// Get enquiry by ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const enquiry = await Enquiry.findOne({ EnquiryNo: id }); // Using EnquiryNo as unique identifier
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry Not Found." });
        }

        res.status(200).json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

const deleteEnquiryData = async (Id) => {
    try {
        const result = await FollowUp.deleteMany({ EnquiryNo: Id });
        if (result.deletedCount === 0) {
            console.log("No document found with the given StudentId.");
        } else {
            console.log(`Successfully deleted fee record with : ${Id}`);
        }
    } catch (error) {
        console.error("Error deleting fee record:", error);
    }
};

// Delete an enquiry
exports.deleteEnquiry = async (req, res) => {
    const { id } = req.params;

    try {
        const enquiry = await Enquiry.findOneAndDelete({ EnquiryNo: id });

        deleteEnquiryData(id)

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry Not Found." });
        }

        res.status(200).json({ message: "Enquiry Deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

// Update an existing enquiry
exports.updateEnquiry = async (req, res) => {
    const { id } = req.params;
    const { Name, FranchiseId, FranchiseName, Course, MobileNo, AMobileNo, Qualification, KnowAbout, Address, PinCode, BatchTime, JoinDate, Remark, Status } = req.body;

    try {
        const enquiry = await Enquiry.findOneAndUpdate(
            { EnquiryNo: id },
            { Name, FranchiseId, FranchiseName, Course, MobileNo, AMobileNo, Qualification, KnowAbout, Address, PinCode, BatchTime, JoinDate, Remark, Status },
            { new: true, runValidators: true }
        );

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry Not Found." });
        }

        res.status(200).json({ message: "Enquiry Updated successfully.", enquiry });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

const feeSlotGenerator = (amountArray) => {
    var result = amountArray.map((value, index) => {
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + index)
        var destructure = String(currentDate.toLocaleDateString()).split("/")
        var formattedDate = `${destructure[0]}/${destructure[1]}/${destructure[2]}`
        return {
            Amount: value,
            Date: formattedDate,
            Status: "UnPaid",
            PaidAmount: 0
        }
    })
    return result;
}

exports.addStudent = async (req, res) => {
    const month = moment().format('MM');
    const year = moment().format('YYYY');
    var { EnquiryNo, FranchiseId, FranchiseName, Name, MobileNo, AMobileNo, Address, PinCode, Qualification, Hour, BatchTime, Course, CourseId, FeeMode } = req.body;
    try {
        // Check and update the student counter for the current month and year
        let counter = await Counter.findOne({ Title: `STU-${year}` });
        if (!counter) {
            counter = new Counter({ Title: `STU-${year}`, Count: 1 });
        } else {
            counter.Count += 1;
        }

        const id = `STU${year}${counter.Count}`;
        const image = req.file ? req.file.filename : null;

        var course = await CourseModel.findOne({ CourseId: CourseId });

        var feeData = course.Price.Plans.find(value => value.PlanName === FeeMode)

        var MyCourseData = {
            CourseId: course.CourseId,
            CourseName: course.CourseName,
            CourseDuration: course.CourseDuration,
            Fee: feeData.TotalFee,
            FeeMode: FeeMode,
            Hour: Hour,
            Slot: BatchTime,
        }

        var objData = {
            StudentId: id,
            CourseId: course.CourseId,
            CourseName: course.CourseName,
            StudentName: Name,
            FranchiseId: FranchiseId,
            FranchiseName,
            TotalFee: feeData.TotalFee,
            PaidFee: 0,
            Balance: feeData.TotalFee,
            FeeSlot: feeSlotGenerator(feeData.Installment),
            Installment: []
        }
        // console.log(MyCourseData)
        // console.log(objData)

        const newStudent = new Student({
            StudentID: id,
            RegistrationNumber: "-",
            AadhaarNumber: "-",
            DateofAdmission: moment().tz("Asia/Kolkata").format('YYYY-MM-DD'),
            FranchiseId,
            Branch: FranchiseName,
            Name,
            Image: image || "-",  // Save only the image name
            Gender: "-",
            DOB: "-",
            MobileNo,
            AlterMobileNo: AMobileNo,
            Address,
            Country: "-",
            State: "-",
            Pincode: PinCode,
            Area: "-",
            Qualification,
            GuardianDetails: [{
                GName: "-",
                GMobileNo: "-",
                GOccupation: "-"
            }],
            Course: [MyCourseData],
            Verified: true
        });

        const newUser = new Login({ Id: id, Password: MobileNo, Role: 'Student' });

        // Save the student record to the database
        await newStudent.save();
        await counter.save();
        await newUser.save();
        await new Fee(objData).save();
        await Enquiry.findOneAndDelete({ EnquiryNo: EnquiryNo });
        deleteEnquiryData(EnquiryNo)



        res.status(201).json({ message: 'Student added successfully', student: newStudent });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding student', error: err.message });
    }
};
