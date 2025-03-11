import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from './components/layouts/Admin/AdminLayout';
import Login from './components/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import SubAdminLayout from './components/layouts/SubAdmin/SubAdminLayout';
import FranchiseLayout from './components/layouts/Franchise/FranchiseLayout';
import StudentLayout from './components/layouts/Student/StudentLayout';
import AdmissionForm from './components/Admin/AdmissionForm';
import SubAdminDashboard from './components/Subadmin/SubAdminDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import AddFranchise from './components/Admin/AddFranchise';
import AllFranchise from './components/Admin/AllFranchise';
import AddTeacher from './components/Admin/AddTeacher';
import AllTeacher from './components/Admin/AllTeacher';
import AddCourse from './components/Admin/AddCourse';
import CreateSyllabus from './components/Admin/CreateSyllabus';
import AddEnquiry from './components/Admin/AddEnquiry';
import EnquiryStatus from './components/Admin/EnquiryStatus';
import Allcourse from './components/Admin/AllCourse';
import TeacherAttendance from './components/Admin/TeacherAttendance';
import StudentAttendance from './components/Admin/StudentAttendance';
import AddBatch from './components/Admin/AddBatch';
import EditTeacher from './components/Admin/EditTeacher';
import ViewTeacher from './components/Admin/ViewTeacher';
import ViewFranchise from './components/Admin/ViewFranchise';
import EditFranchise from './components/Admin/EditFranchise';
import AllStudent from './components/Admin/AllStudent';
import Profile from './components/Subadmin/Profile';
import TeacherProfile from './components/Teacher/TeacherProfile';
import MyCourses from './components/Subadmin/MyCourses';
import EnrollCourses from './components/Subadmin/EnrollCourses';
import FeeReceipt from './components/Admin/FeeReceipt';
import AllFee from './components/Admin/AllFee';
import AllSalary from './components/Admin/AllSalary';
import ViewStudent from './components/Admin/ViewStudent';
import CourseDetail from './components/Admin/CourseDetail';
import AttendancePage from './components/Admin/AttendanceType';
import PendingStudent from './components/Admin/PendingStudent';
import ViewPendingStudent from './components/Admin/ViewPendingStudent';
import EditStudent from './components/Admin/EditStudent';
import CollectFee from './components/Admin/CollectFee';
import PaymentPage from './components/Admin/PaymentPage';
import BatchTable from './components/Admin/BatchTable';
import EnquiryPage from './components/Admin/EnquiryPage';
import EditEnquiry from './components/Admin/EditEnquiry';
import FollowUpPage from './components/Admin/FollowUPPage';
import StudentProfile from './components/Student/StudentProfile';
import StudentCourse from './components/Student/StudentCourse';
import ViewDetails from './components/Student/ViewDetails';
import BatchTiming from './components/Student/BatchTiming';
import AddCertificate from './components/Admin/AddCertificate';
import EditCertificate from './components/Admin/EditCertificate';
import CertificatesList from './components/Admin/CertificatesList';
import StudentCourseTable from './components/Admin/StudentCourseTable';
import ViewMarksheetPage from './components/Admin/ViewMarksheetPage';
import ViewCertificatePage from './components/Admin/ViewCertificatePage';
import UpdateBatch from './components/Admin/UpdateBatch';
import CertificateVerification from './components/Admin/CertificateVerification';
import Certificate from './components/Student/Certificate';
import ChangePassword from './components/Admin/ChangePassword';
import ViewPassword from './components/Admin/ViewPassword';
import ExcelToJsonConverter from './components/Admin/ExcelToJsonConverter';
import VerificationPage from './components/VerificationPage';
import PendingFee from './components/Admin/PendingFee';
import PayFee from './components/Admin/PayFee';
import BlankCertificate from './components/Admin/BlankCertificate';
import BlankMarksheet from './components/Admin/BlankMarksheet';
import AttendanceTable from './components/Admin/ViewSalaryData';
import Transaction from './components/Admin/Transaction';

const App = () => {
  return (
    <>
      <Routes>
        {/* Route for the Login page */}
        <Route path="/" element={<Login />} />
        <Route path="/verification/:certificateId" element={<VerificationPage />} />
  
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="admissionform" element={<AdmissionForm />} />
          <Route path="addfranchise" element={<AddFranchise />} />
          <Route path="allfranchise" element={<AllFranchise />} />
          <Route path="addteacher" element={<AddTeacher />} />
          <Route path="allteacher" element={<AllTeacher />} />
          <Route path="addcourse" element={<AddCourse />} />
          <Route path="addenquiry" element={<AddEnquiry />} />
          <Route path="enquirystatus" element={<EnquiryStatus />} />
          <Route path="allcourse" element={<Allcourse />} />
          <Route path="createsyllabus/:id" element={<CreateSyllabus />} />
          <Route path="teacherattendance" element={<TeacherAttendance />} />
          <Route path="studentattendance" element={<StudentAttendance />} />
          <Route path="addbatch" element={<AddBatch />} />
          <Route path="all-batch" element={<BatchTable />} />
          <Route path="editteacher" element={<EditTeacher />} />
          <Route path="viewteacher" element={<ViewTeacher />} />
          <Route path="viewfranchise" element={<ViewFranchise />} />
          <Route path="editfranchise" element={<EditFranchise />} />
          <Route path="allstudent" element={<AllStudent />} />
          <Route path="pending-student" element={<PendingStudent />} />
          <Route path="feereceipt" element={<FeeReceipt />} />
          <Route path="allfee" element={<AllFee />} />
          <Route path="collect-fee" element={<CollectFee />} />
          <Route path="pending-fee" element={<PendingFee />} />
          <Route path="Pay-fee" element={<PayFee />} />
          <Route path="payment/:StudentId/:CourseId" element={<PaymentPage />} />
          <Route path="allsalary" element={<AllSalary />} />
          <Route path="viewstudent" element={<ViewStudent />} />
          <Route path="coursedetail/:courseId" element={<CourseDetail />} />
          <Route path="attendancetype" element={<AttendancePage />} />
          <Route path="view-pending-student" element={<ViewPendingStudent />} />
          <Route path="editstudent" element={<EditStudent />} />
          <Route path="enquiry-page" element={<EnquiryPage />} />
          <Route path="enquiry-edit" element={<EditEnquiry />} />
          <Route path="enquiry-followup" element={<FollowUpPage />} />
          <Route path="add-certificate" element={<AddCertificate />} />
          <Route path="list-certificate" element={<CertificatesList />} />
          <Route path="edit-certificate" element={<EditCertificate />} />
          <Route path="course-table" element={<StudentCourseTable />} />
          <Route path="view-marksheet/:certificateId" element={<ViewMarksheetPage />} />
          <Route path="view-certificate/:certificateId" element={<ViewCertificatePage />} />
          <Route path="blank-marksheet/:certificateId" element={<BlankMarksheet />} />
          <Route path="blank-certificate/:certificateId" element={<BlankCertificate />} />
          <Route path="approve-certificate" element={<CertificateVerification />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="view-password" element={<ViewPassword />} />
          <Route path="bulk-upload-Enquiry" element={<ExcelToJsonConverter />} />
          <Route path="View-Teacher-Salary" element={<AttendanceTable />} />
          <Route path="View-transaction" element={<Transaction />} />
        </Route>

        {/* Sub Admin Routes */}
        <Route path="/branch" element={<SubAdminLayout />}>
          <Route path="dashboard" element={<SubAdminDashboard />} />
          <Route path="View-Teacher-Salary" element={<AttendanceTable />} />
          <Route path="feereceipt" element={<FeeReceipt />} />
          <Route path="enquiry-edit" element={<EditEnquiry />} />
          <Route path="admissionform" element={<AdmissionForm />} />
          <Route path="addteacher" element={<AddTeacher />} />
          <Route path="allsalary" element={<AllSalary />} />
          <Route path="allteacher" element={<AllTeacher />} />
          <Route path="addenquiry" element={<AddEnquiry />} />
          <Route path="enquirystatus" element={<EnquiryStatus />} />
          <Route path="allcourse" element={<MyCourses />} />
          <Route path="enrollcourses" element={<EnrollCourses />} />
          <Route path="teacherattendance" element={<TeacherAttendance />} />
          <Route path="studentattendance" element={<StudentAttendance />} />
          <Route path="addbatch" element={<AddBatch />} />
          <Route path="editteacher" element={<EditTeacher />} />
          <Route path="viewteacher" element={<ViewTeacher />} />
          <Route path="viewfranchise" element={<ViewFranchise />} />
          <Route path="editfranchise" element={<EditFranchise />} />
          <Route path="allstudent" element={<AllStudent />} />
          <Route path="profile" element={<Profile />} />
          <Route path="enquiry-page" element={<EnquiryPage />} />
          <Route path="enquiry-followup" element={<FollowUpPage />} />
          <Route path="attendancetype" element={<AttendancePage />} />
          <Route path="collect-fee" element={<CollectFee />} />
          <Route path="pending-fee" element={<PendingFee />} />
          <Route path="allfee" element={<AllFee />} />
          <Route path="update-batch" element={<UpdateBatch />} />
          <Route path="payment/:StudentId/:CourseId" element={<PaymentPage />} />
          <Route path="View-Teacher-Salary" element={<AttendanceTable />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Franchise Routes */}
        <Route path="/teacher" element={<FranchiseLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="dashboard" element={<SubAdminDashboard />} />
          <Route path="admissionform" element={<AdmissionForm />} />
          <Route path="addfranchise" element={<AddFranchise />} />
          <Route path="allfranchise" element={<AllFranchise />} />
          <Route path="addteacher" element={<AddTeacher />} />
          <Route path="allteacher" element={<AllTeacher />} />
          <Route path="addcourse" element={<AddCourse />} />
          <Route path="addenquiry" element={<AddEnquiry />} />
          <Route path="enquirystatus" element={<EnquiryStatus />} />
          <Route path="allcourse" element={<Allcourse />} />
          <Route path="createsyllabus/:id" element={<CreateSyllabus />} />
          <Route path="teacherattendance" element={<TeacherAttendance />} />
          <Route path="studentattendance" element={<StudentAttendance />} />
          <Route path="addbatch" element={<AddBatch />} />
          <Route path="editteacher" element={<EditTeacher />} />
          <Route path="viewteacher" element={<ViewTeacher />} />
          <Route path="viewfranchise" element={<ViewFranchise />} />
          <Route path="editfranchise" element={<EditFranchise />} />
          <Route path="allstudent" element={<AllStudent />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="attendancetype" element={<AttendancePage />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="studentcourse" element={<StudentCourse />} />
          <Route path="course/:courseId" element={<ViewDetails />} />
          <Route path="batchtiming" element={<BatchTiming />} />
          <Route path="certificate" element={<Certificate />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
