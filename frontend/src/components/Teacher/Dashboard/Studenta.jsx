import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import styled from "styled-components";



const Student = ({ setStudentCount }) => {
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherAndStudents = async () => {
      try {
        const teacherId = localStorage.getItem("Id"); // Retrieve teacherId from localStorage

        if (!teacherId) {
          setError("TeacherId is not available in localStorage");
          return;
        }

        // Fetch teacher data based on teacherId
        const teacherResponse = await fetch(`https://franchiseapi.kictindia.com/teacher/all`);
        if (!teacherResponse.ok) {
          throw new Error("Error fetching teacher data");
        }
        const teacherData = await teacherResponse.json();

        // Find the teacher by teacherId
        const loggedInTeacher = teacherData.find(
          (teacher) => teacher.TeacherID === teacherId
        );

        if (!loggedInTeacher) {
          setError("Teacher not found");
          return;
        }

        setTeacher(loggedInTeacher);

        // Fetch student data
        const studentResponse = await fetch(`https://franchiseapi.kictindia.com/student/all`);
        if (!studentResponse.ok) {
          throw new Error("Error fetching student data");
        }
        const studentData = await studentResponse.json();

        // Filter students based on the FranchiseId and matching courses
        const filteredStudents = studentData.filter((student) => {
          // Check if student has the same FranchiseId and course in the same franchise
          const isInSameFranchise = student.FranchiseId === loggedInTeacher.FranchiseId;
          const hasMatchingCourse = student.Course.some((course) =>
            loggedInTeacher.Role.includes(course.CourseName)
          );
          return isInSameFranchise && hasMatchingCourse;
        });

        setStudents(filteredStudents);

        // Set the student count in the parent component
        setStudentCount(filteredStudents.length);
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAndStudents();
  }, [setStudentCount]);

  // Define table columns
  const columns = [
    {
      name: "StudentID",
      label: "Student ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Name",
      label: "Student Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Course",
      label: "Courses",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) =>
          value
            .map((course) => `${course.CourseName}`)
            .join(", "),
      },
    },
    {
      name: "Slot",
      label: "Slot Timing",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => { 
          const courses = tableMeta.rowData[2]; // Course data is in the 3rd column (index 2)
          return courses.map((course) => course.Slot).join(", ");
        },
      },
    },
    {
      name: "Image",
      label: "Photo",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <img
            src={`https://franchiseapi.kictindia.com/uploads/${value}`}
            alt="Student"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          />
        ),
      },
    },
  ];

  // Table options with custom title font size
  const options = {
    filterType: "select",
    responsive: "scrollMaxHeight", // Options: "vertical", "standard", "simple"
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    download: true,
    print: true,
    selectableRows: "none", // Disable row selection
    elevation: 4, // Material UI box-shadow for the table
    textLabels: {
      body: {
        noMatch: loading
          ? "Loading data..."
          : "Sorry, no matching records found",
      },
    },
    components: {
      TableToolbar: (props) => (
        <Box p={2}>
          {/* Customizing the title */}
          <Typography
            variant="h5"
            style={{
              fontSize: "8px", // Customize the font size here
              color: "#1a237e",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Students Under {teacher ? teacher.Name : "Teacher"}
          </Typography>
        </Box>
      ),
    },
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <MUIDataTable
        title={`Students Under ${teacher ? teacher.Name : "Teacher"}`}
        data={students}
        columns={columns}
        options={options}
      />
    </Box>
  );
};

export default Student;
