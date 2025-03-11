const Salary = require("../models/salaryModel");
const StaffAttendance = require("../models/staffAttendance");
const Teacher = require("../models/teacherModel");


// Add a new salary entry
const addSalary = async (req, res) => {
    try {
        const { TeacherId, Name, Month, Year, Amount, Status } = req.body;
        const newSalary = new Salary({ TeacherId, Name, Month, Year, Amount, Status });
        await newSalary.save();
        res.status(201).json({ message: "Salary added successfully", salary: newSalary });
    } catch (err) {
        res.status(500).json({ message: "Error adding salary", error: err });
    }
};

// Get all salaries
const getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find();
        res.status(200).json({ salaries });
    } catch (err) {
        res.status(500).json({ message: "Error fetching salaries", error: err });
    }
};

// Get salary by ID
const getSalaryById = async (req, res) => {
    try {
        const { id } = req.params;
        const salary = await Salary.findById(id);
        if (!salary) {
            return res.status(404).json({ message: "Salary not found" });
        }
        res.status(200).json({ salary });
    } catch (err) {
        res.status(500).json({ message: "Error fetching salary", error: err });
    }
};

// Get salary by Month and Year
const getSalariesByMonthAndYear = async (req, res) => {
    try {
        const { month, year } = req.params;
        const salaries = await Salary.find({ Month: month, Year: year });
        if (salaries.length === 0) {
            return res.status(404).json({ message: "No salaries found for this month and year" });
        }
        res.status(200).json({ salaries });
    } catch (err) {
        res.status(500).json({ message: "Error fetching salaries by month and year", error: err });
    }
};

// Update a salary by ID
const updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { TeacherId, Name, Month, Year, Amount, Status } = req.body;

        const updatedSalary = await Salary.findByIdAndUpdate(
            id,
            { TeacherId, Name, Month, Year, Amount, Status },
            { new: true } // This returns the updated document
        );
        if (!updatedSalary) {
            return res.status(404).json({ message: "Salary not found" });
        }
        res.status(200).json({ message: "Salary updated successfully", salary: updatedSalary });
    } catch (err) {
        res.status(500).json({ message: "Error updating salary", error: err });
    }
};

// Delete a salary by ID
const deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSalary = await Salary.findByIdAndDelete(id);
        if (!deletedSalary) {
            return res.status(404).json({ message: "Salary not found" });
        }
        res.status(200).json({ message: "Salary deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting salary", error: err });
    }
};

const getAttendanceByMonth = async (req, res) => {
    try {
        // Get the current date and determine the last month of this year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let lastMonth = currentDate.getMonth();  // getMonth() returns 0 for January, 11 for December

        // Adjust last month if we're in January (so last month is December of the previous year)
        if (lastMonth === 0) {
            lastMonth = 12;  // December
        }

        // Format month as 2 digits (e.g., "01" for January, "12" for December)
        const month = String(lastMonth).padStart(2, '0');

        // Find records where the 'Date' month matches the last month's year and month
        const attendanceRecords = await StaffAttendance.find({
            Date: {
                $regex: `^${currentYear}-${month}-`, // Regex to match year-month format (e.g., 2024-12-)
            }
        });

        // Check if any records were found for the last month
        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: `No attendance records found for month ${month} of ${currentYear}.` });
        }

        // Create an object to store Present Count and salary data for each teacher
        const teacherPresentCount = {};

        // Iterate over the filtered records
        for (const attendance of attendanceRecords) {
            // Loop through each attendance entry for each record
            console.log(attendance)
            for (const entry of attendance.Attendance) {
                if (entry.Status === 'Present') {
                    // If the teacher is marked as Present, increment their count
                    if (!teacherPresentCount[entry.TeacherId]) {
                        teacherPresentCount[entry.TeacherId] = {
                            Name: entry.Name,
                            FranchiseId: attendance.FranchiseId,
                            PresentCount: 0,
                            Salary: 0,
                            Month: lastMonth,
                            Year: currentYear,
                            BaseSalary: 0,
                            Status: 'Unpaid'
                        };
                    }
                    teacherPresentCount[entry.TeacherId].PresentCount += 1;
                }
            }
        }

        // Now, get the salary information for each teacher and calculate salary
        const teacherIds = Object.keys(teacherPresentCount);
        const teachers = await Teacher.find({ TeacherID: { $in: teacherIds } });

        // Update the teacherPresentCount with salary data and calculate salary
        teachers.forEach(teacher => {
            if (teacherPresentCount[teacher.TeacherID]) {
                const presentDays = teacherPresentCount[teacher.TeacherID].PresentCount;

                // Calculate salary based on 26 working days in the month
                const monthlySalary = teacher.Salary;
                const salaryForPresentDays = (presentDays / 26) * monthlySalary;

                teacherPresentCount[teacher.TeacherID].Salary = Math.round(salaryForPresentDays);
                teacherPresentCount[teacher.TeacherID].BaseSalary = monthlySalary;
            }
        });

        // Prepare the result by transforming the teacherPresentCount object into an array
        const result = Object.values(teacherPresentCount);

        // Send the response with the filtered data
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

const paySalary = async (req, res) => {
    try {
        const { teacherId, month, year, amount } = req.body;
        const salaryData = await Salary.findOne({ TeacherId: teacherId, Month: month, Year: year });
        if (!salaryData) {
            return res.status(404).json({ message: "Salary not found" });
        }
        salaryData.PaidAmount = amount;
        salaryData.Status = "Paid"
        await salaryData.save();
        res.status(200).json({ message: "Salary Paid successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error while Paying salary", error: err });
    }
};

module.exports = {
    addSalary,
    getAllSalaries,
    getSalaryById,
    getSalariesByMonthAndYear,
    updateSalary,
    deleteSalary,
    getAttendanceByMonth,
    paySalary
};
