const StaffAttendance = require("../models/staffAttendance");
const Teacher = require("../models/teacherModel");

// Add new attendance record
const addAttendance = async (req, res) => {
    const { Date, FranchiseId, FranchiseName, Attendance } = req.body;

    try {
        // Check if attendance already exists for this Date and FranchiseId
        const existingRecord = await StaffAttendance.findOne({ Date, FranchiseId });

        if (existingRecord) {
            return res.status(400).json({ message: 'Attendance record for this Date and FranchiseId already exists.' });
        }

        const newAttendance = new StaffAttendance({
            Date,
            FranchiseId,
            FranchiseName,
            Attendance
        });

        await newAttendance.save();
        res.status(201).json(newAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

// Get all attendance records
const getAllAttendance = async (req, res) => {
    try {
        const attendances = await StaffAttendance.find();
        res.json(attendances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get attendance record by ID
const getAttendanceById = async (req, res) => {
    try {
        const attendance = await StaffAttendance.findById(req.params.id);
        if (!attendance) return res.status(404).json({ message: "Attendance record not found" });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update attendance record by ID
const updateAttendance = async (req, res) => {
    const { Date, FranchiseId, FranchiseName, Attendance } = req.body;  // Add FranchiseName

    try {
        const updatedAttendance = await StaffAttendance.findOneAndUpdate(
            { Date, FranchiseId},
            { Date, FranchiseId, FranchiseName, Attendance },
            { new: true, runValidators: true }
        );

        if (!updatedAttendance) {
            const newAttendance = new StaffAttendance({
                Date,
                FranchiseId,
                FranchiseName,
                Attendance
            });
    
            await newAttendance.save();
            res.status(201).json(newAttendance);
            return;
        };
        res.json(updatedAttendance);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};


// Delete attendance record by ID
const deleteAttendance = async (req, res) => {
    try {
        const deletedAttendance = await StaffAttendance.findByIdAndDelete(req.params.id);
        if (!deletedAttendance) return res.status(404).json({ message: "Attendance record not found" });
        res.json({ message: "Attendance record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAttendanceByFranchiseAndDate = async (req, res) => {
    const { franchiseId, date } = req.body;
    console.log(req.body)

    try {
        // Find attendance record based on FranchiseName and Date
        const attendance = await StaffAttendance.findOne({
            FranchiseId: franchiseId,
            Date: date
        }
        );

        if (!attendance) {
            return res.status(404).json({ message: "No attendance record found for this Franchise and Date" });
        }

        res.json(attendance);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const getTeacherAttendanceByMonth = async (req, res) => {
    try {
        const { teacherId, month, year } = req.body;
        console.log(req)

        if (!teacherId || !month || !year) {
            return res.status(400).json({ error: "TeacherId, month, and year are required." });
        }

        // Format month to two digits
        const formattedMonth = month.padStart(2, "0");

        // Query database for records in the specified year and month
        const attendanceRecords = await StaffAttendance.find({
            Date: { $regex: `^${year}-${formattedMonth}-\\d{2}$` },
        });

        const TeacherData = await Teacher.findOne({ TeacherID: teacherId });
        console.log(TeacherData)
        var daily = TeacherData.Salary / 26;

        // Initialize a map for dates and days
        const daysInMonth = new Date(year, month, 0).getDate();
        const datesAndDays = Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(year, month - 1, i + 1);
            return {
                Date: `${String(i + 1).padStart(2, "0")}/${formattedMonth}/${year}`,
                Day: date.toLocaleString("en-US", { weekday: "long" }),
                Attendance: "-",
                Rate: "-",
                PerDay:"-",
            };
        });

        // Process attendance data
        attendanceRecords.forEach((record) => {
            const attendance = record.Attendance.find(
                (entry) => entry.TeacherId === teacherId
            );

            if (attendance) {
                const date = new Date(record.Date);
                const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${formattedMonth}/${year}`;

                const dayData = datesAndDays.find((d) => d.Date === formattedDate);
                if (dayData) {
                    dayData.Attendance = attendance.Status || "-";
                    dayData.Rate =
                        attendance.Status === "Present"
                            ? 1
                            : attendance.Status === "HalfDay"
                                ? 0.5
                                : attendance.Status === "Absent"
                                    ? 0
                                    : "-";
                    dayData.PerDay = attendance.Status === "Present"
                        ? Math.round(1 * daily)
                        : attendance.Status === "HalfDay"
                            ? Math.round(0.5 * daily)
                            : attendance.Status === "Absent"
                                ? (0 * daily)
                                : "-";
                }
            }
        });

        res.status(200).json({ baseSalary:TeacherData.Salary, attendance: datesAndDays });
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({ error: "An error occurred while fetching attendance records." });
    }
};

module.exports = {
    addAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getAttendanceByFranchiseAndDate,
    getTeacherAttendanceByMonth
};
