const express = require("express");
const cors = require("cors");
const loginRoutes = require('./routes/loginRoutes');
const studentRoutes = require('./routes/studentRoutes');
const pendingStudentRoutes = require('./routes/pendingStudentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const franchiseRoutes = require('./routes/franchiseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseFranchiseRoutes = require('./routes/courseFranchiseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const courseRoutes = require('./routes/courseRoutes');
const feeRoutes = require('./routes/feeRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const studentAttendanceRoutes = require('./routes/studentAttendanceRoutes');
const staffAttendanceRoutes = require('./routes/staffAttendanceRoutes');
const batchRoutes = require('./routes/batchRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const cronJobs = require("./controllers/cronJobs");
const followUpRoutes = require('./routes/followUpRoutes');

const app = express();
require("./config/db")
cronJobs;

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

app.use('/user', loginRoutes);
app.use('/student', studentRoutes);
app.use('/pending-student', pendingStudentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/admin', adminRoutes);
app.use('/franchise', franchiseRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/course', courseRoutes); 
app.use('/course-franchise', courseFranchiseRoutes);
app.use('/fee', feeRoutes);
app.use('/certificates', certificateRoutes);
app.use('/enquiry', enquiryRoutes);
app.use('/staff-attendance', staffAttendanceRoutes);
app.use('/student-attendance', studentAttendanceRoutes);
app.use('/batch', batchRoutes);
app.use("/salary", salaryRoutes);
app.use('/followups', followUpRoutes);

app.get('/', (req, res) => res.send('<h1 style="display:flex;height: 100%;align-items: center;justify-content: center;margin:0;">Server Is Running!!!!</h1>'));

const PORT = 8000;
app.listen(PORT, () => console.log(`Server is Running on ${PORT}`));
