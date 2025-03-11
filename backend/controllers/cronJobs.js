const cron = require('node-cron');
const StaffAttendance = require('../models/staffAttendance');  // Adjust the path as necessary
const Teacher = require('../models/teacherModel');  // Adjust the path as necessary
const Salary = require('../models/salaryModel');  // Adjust the path as necessary

// Array to map numeric month (0-11) to month names
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Schedule the job to run at midnight on the first day of every month
const generateMonthlySalaries = async () => {
    try {
        console.log('Running cron job to generate salary data for the previous month.');

        // Get the current date and determine the last month of the current year
        const currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        let lastMonth = currentDate.getMonth();  // getMonth() returns 0 for January, 11 for December

        // Adjust last month if we're in January (so last month is December of the previous year)
        if (lastMonth === 0) {
            lastMonth = 12;  // December
            currentYear--;
        }

        // Format month as 2 digits (e.g., "01" for January, "12" for December)
        const month = String(lastMonth).padStart(2, '0');

        // Find attendance records where the 'Date' month matches the last month's year and month
        const attendanceRecords = await StaffAttendance.find({
            Date: {
                $regex: `^${currentYear}-${month}-`, // Regex to match year-month format (e.g., 2024-12-)
            }
        });

        // If no records are found, exit
        if (attendanceRecords.length === 0) {
            console.log(`No attendance records found for month ${month} of ${currentYear}.`);
            return;
        }

        // Create an object to store Present Count and salary data for each teacher
        const teacherPresentCount = {};

        // Iterate over the filtered records and compute attendance counts
        for (const attendance of attendanceRecords) {
            for (const entry of attendance.Attendance) {
                if (entry.Status === 'Present') {
                    if (!teacherPresentCount[entry.TeacherId]) {
                        teacherPresentCount[entry.TeacherId] = {
                            TeacherId: entry.TeacherId,
                            Name: entry.Name,
                            FranchiseId: attendance.FranchiseId,
                            PresentCount: 0,
                            Month: monthNames[lastMonth - 1],
                            Year: currentYear,
                            BaseSalary: 0,
                            Status: 'Unpaid',
                            PaidAmount: 0,
                        };
                    }
                    teacherPresentCount[entry.TeacherId].PresentCount += 1;
                } else if (entry.Status === 'HalfDay') {
                    if (!teacherPresentCount[entry.TeacherId]) {
                        teacherPresentCount[entry.TeacherId] = {
                            TeacherId: entry.TeacherId,
                            Name: entry.Name,
                            FranchiseId: attendance.FranchiseId,
                            PresentCount: 0,
                            Month: monthNames[lastMonth - 1],
                            Year: currentYear,
                            BaseSalary: 0,
                            Status: 'Unpaid',
                            PaidAmount: 0,
                        };
                    }
                    teacherPresentCount[entry.TeacherId].PresentCount += 0.5;
                }
            }
        }

        // Now, get the salary information for each teacher and calculate their salary
        const teacherIds = Object.keys(teacherPresentCount);
        const teachers = await Teacher.find({ TeacherID: { $in: teacherIds } });

        // Update the teacherPresentCount with salary data and calculate salary for present days
        teachers.forEach(teacher => {
            if (teacherPresentCount[teacher.TeacherID]) {
                const presentDays = teacherPresentCount[teacher.TeacherID].PresentCount;

                // Calculate salary based on 26 working days in the month
                const monthlySalary = teacher.Salary;
                const salaryForPresentDays = (presentDays / 26) * monthlySalary;

                teacherPresentCount[teacher.TeacherID].BaseSalary = monthlySalary;
                teacherPresentCount[teacher.TeacherID].Salary = Math.round(salaryForPresentDays);
            }
        });

        // Prepare the result by transforming the teacherPresentCount object into an array
        const result = Object.values(teacherPresentCount);

        // Before saving, check if the data already exists in the Salary collection
        for (const teacherData of result) {
            const existingRecord = await Salary.findOne({
                TeacherId: teacherData.TeacherId,
                Month: teacherData.Month,
                Year: teacherData.Year
            });

            if (existingRecord) {
                // If the record exists, skip saving and log it
                console.log(`Salary data for TeacherId ${teacherData.TeacherId} for ${teacherData.Month}-${teacherData.Year} already exists. Skipping.`);
            } else {
                // If no record exists, save the new data
                const newSalaryData = new Salary(teacherData);
                await newSalaryData.save();
                console.log(`New salary data saved for TeacherId ${teacherData.TeacherId} for ${teacherData.Month}-${teacherData.Year}`);
            }
        }

    } catch (error) {
        console.error('Error in cron job:', error);
    }
};


// Schedule a cron job to run at midnight on the 1st of each month
cron.schedule('0 0 1 * *', () => {
    console.log('Running salary generation job...');
    generateMonthlySalaries(); // Call the function to generate salaries
});
