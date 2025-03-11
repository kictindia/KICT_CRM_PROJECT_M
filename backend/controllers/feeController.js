const moment = require('moment');
const Fee = require('../models/feeModel');

// Add a new fee record
const addFee = async (req, res) => {
    try {
        const {
            StudentId,
            CourseId,
            StudentName,
            CourseName,
            TotalFee,
            PaidFee,
            Balance,
            FranchiseId,
            FranchiseName,
            Installment
        } = req.body;

        // If Installment data is provided, we will add current Date and Time
        if (Installment && Installment.length > 0) {
            Installment.forEach(installment => {
                installment.Date = moment().format('YYYY-MM-DD'); // Current date
                installment.Time = moment().format('HH:mm:ss');  // Current time
            });
        }

        // Create a new fee document
        const newFee = new Fee({
            StudentId,
            CourseId,
            StudentName,
            CourseName,
            TotalFee,
            PaidFee,
            Balance,
            FranchiseId,
            FranchiseName,
            Installment
        });

        // Save the fee to the database
        await newFee.save();

        res.status(201).json({
            message: 'Fee record added successfully!',
            data: newFee
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

// Controller to handle adding installments to a specific student's fee
const addInstallment = async (req, res) => {
    const { studentId, courseId } = req.params;
    const { installment } = req.body;

    try {
        const feeRecord = await Fee.findOne({ StudentId: studentId, CourseId: courseId });

        if (!feeRecord) {
            return res.status(404).json({ message: "Fee record not found" });
        }

        // console.log(feeRecord.FeeSlot[installment.Installment].Amount)
        feeRecord.FeeSlot[installment.Installment - 1].Amount = feeRecord.FeeSlot[installment.Installment - 1].Amount - installment.Amount;
        // Update balance after adding the installment
        if(feeRecord.FeeSlot[installment.Installment - 1].Amount == 0){
            feeRecord.FeeSlot[installment.Installment - 1].Status = "Paid";
        }
        feeRecord.FeeSlot[installment.Installment - 1].PaidAmount = installment.Amount;
        feeRecord.Balance -= installment.Amount;
        feeRecord.PaidFee += installment.Amount;
        feeRecord.Installment.push(installment);
        // console.log(installment)
        // console.log(feeRecord)
        
        // Save the updated fee record
        await feeRecord.save();

        return res.status(200).json({ message: "Installment added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error adding installment" });
    }
};

// Get all fee records
const getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find();
        res.status(200).json(fees);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get fee record by StudentId and CourseId
const getFeeByStudentAndCourse = async (req, res) => {
    try {
        const { StudentId, CourseId } = req.params;

        const fee = await Fee.findOne({ StudentId, CourseId });
        if (!fee) {
            return res.status(404).json({ message: 'Fee record not found' });
        }
        res.status(200).json(fee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update fee record by StudentId and CourseId
const updateFee = async (req, res) => {
    try {
        const { StudentId, CourseId } = req.params;

        // Add current date and time for each installment (if any update to Installment)
        if (req.body.Installment && req.body.Installment.length > 0) {
            req.body.Installment.forEach(installment => {
                installment.Date = moment().format('YYYY-MM-DD'); // Current date
                installment.Time = moment().format('HH:mm:ss');  // Current time
            });
        }

        // Find and update the fee record by StudentId and CourseId
        const updatedFee = await Fee.findOneAndUpdate(
            { StudentId, CourseId },
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedFee) {
            return res.status(404).json({ message: 'Fee record not found' });
        }

        res.status(200).json({
            message: 'Fee record updated successfully',
            data: updatedFee
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete fee record by StudentId and CourseId
const deleteFee = async (req, res) => {
    try {
        const { StudentId, CourseId } = req.params;

        // Find and delete the fee record by StudentId and CourseId
        const fee = await Fee.findOneAndDelete({ StudentId, CourseId });

        if (!fee) {
            return res.status(404).json({ message: 'Fee record not found' });
        }

        res.status(204).send(); // Successfully deleted, no content to return
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addFee,
    addInstallment,
    getAllFees,
    getFeeByStudentAndCourse,
    updateFee,
    deleteFee
};
