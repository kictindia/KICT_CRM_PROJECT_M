import React, { useState, useEffect } from "react";
import axios from "axios";
import { DatePicker, Input, Button } from "antd"; // Import Input and Button from Ant Design
import styled from "styled-components";
import dayjs from 'dayjs';
import MUIDataTable from "mui-datatables"; // Import MUI DataTable
import { createTheme, ThemeProvider } from "@mui/material/styles"; // Import for customizing MUIDataTable theme


const AttendancePage = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [date, setDate] = useState(null); // To hold selected date
    const [teacherAttendance, setTeacherAttendance] = useState([]);
    const [studentAttendance, setStudentAttendance] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // To store search term for franchise name
    const [showTeachers, setShowTeachers] = useState(true); // To toggle between teacher and student attendance

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemPerPage] = useState(5);
    useEffect(() => {
        const today = dayjs(); // Get today's date using dayjs
        setDate(today); // Set the date to today's dayjs object
        fetchAttendanceData(today.format('YYYY-MM-DD')); // Fetch today's attendance
    }, []);

    // Fetch attendance data for the selected date
    const fetchAttendanceData = async (selectedDate) => {
        if (!selectedDate) return;

        // Fetch teacher attendance data
        try {
            const response = await axios.get(`https://franchiseapi.kictindia.com/staff-attendance/all`);
            const staffData = response.data;

            // Filter staff attendance by selected date and ensure the Attendance array exists
            const filteredStaff = staffData.filter(
                (item) => item.Date === selectedDate
            );

            // Extract the Attendance array for each entry, attaching FranchiseId and FranchiseName to each attendance
            const teacherData = filteredStaff.map((entry) =>
                entry.Attendance.map((teacher) => ({
                    ...teacher,
                    FranchiseId: entry.FranchiseId,
                    FranchiseName: entry.FranchiseName,
                }))
            ).flat();

            const role = localStorage.getItem("Role");
            if (role === "Franchise") {
                const id = localStorage.getItem("Id");
                const filterData = teacherData.filter((val) => val.FranchiseId === id);
                setTeacherAttendance(filterData);
            } else if (role === "Teacher") {
                const id = JSON.parse(localStorage.getItem("TeacherData"));
                const filterData = teacherData.filter(
                    (val) => val.FranchiseId === id.FranchiseId
                );
                setTeacherAttendance(filterData);
            } else {
                setTeacherAttendance(teacherData);
            }

            // Set teacher attendance
            // setTeacherAttendance(teacherData);
        } catch (error) {
            console.error("Error fetching staff attendance data:", error);
        }

        // Fetch student attendance data
        try {
            const response = await axios.get(`https://franchiseapi.kictindia.com/student-attendance/all`);
            const studentData = response.data;

            // Filter student attendance by selected date and ensure the Attendance array exists
            const filteredStudents = studentData.filter(
                (item) => item.Date === selectedDate
            );

            // Extract the Attendance array for each entry
            const studentDataList1 = filteredStudents.map((entry) => {
                return entry.Attendance.map((attendance) => {
                    return {
                        ...attendance,
                        Course: entry.Course,         // Add Course
                        Hour: entry.Batch.Hour,      // Add Hour
                        BatchName: entry.Batch.Name  // Add Batch Name
                    };
                });
            }).flat();

            const role = localStorage.getItem("Role");
            if (role === "Franchise") {
                const id = localStorage.getItem("Id");
                const filterData = studentDataList1.filter((val) => val.Course === id);
                setStudentAttendance(filterData);
            } else if (role === "Teacher") {
                const id = JSON.parse(localStorage.getItem("TeacherData"));
                const filterData = studentDataList1.filter(
                    (val) => val.Course === id.FranchiseId
                );
                setStudentAttendance(filterData);
            } else {
                setStudentAttendance(studentDataList1);
            }
            console.log(studentDataList1)

            // Set student attendance
        } catch (error) {
            console.error("Error fetching student attendance data:", error);
        }
    };

    // Handle date change
    const handleDateChange = (date, dateString) => {
        if (date && date.isValid()) {
            setDate(date);
            fetchAttendanceData(dateString); // Fetch attendance data for the selected date
        } else {
            console.error('Invalid date');
        }
    };

    // Handle search change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update the search term
    };

    // Filter teacher attendance based on search term
    const filteredTeacherAttendance = teacherAttendance.filter((teacher) =>
        teacher.FranchiseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Columns for Teacher and Student Attendance in MUIDataTable format
    const teacherColumns = [
        { name: 'Name', label: 'Name' },
        { name: 'Status', label: 'Status' },
        { name: 'FranchiseId', label: 'FranchiseId' },
        { name: 'FranchiseName', label: 'FranchiseName' },
    ];

    const studentColumns = [
        { name: 'StudentId', label: 'Student Id' },
        { name: 'Name', label: 'Name' },
        { name: 'Course', label: 'Franchise' },
        { name: 'Hour', label: 'Hour' },
        { name: 'BatchName', label: 'Slot' },
        { name: 'Status', label: 'Status' },
    ];

    const getMuiTheme = () =>
        createTheme({
            components: {
                MuiTablePagination: {
                    styleOverrides: {
                        toolbar: {
                            padding: "10px 16px", // Add padding to the pagination toolbar
                        },
                        spacer: {
                            flex: "none", // Prevent the spacer from consuming extra space
                        },
                        actions: {
                            marginLeft: "8px", // Space between rows per page and actions
                        },
                    },
                },
                MuiTableContainer: {
                    styleOverrides: {
                        root: {
                            maxHeight: "calc(100vh - 300px)", // Ensure the table scrolls properly
                        },
                    },
                },
            },
        });

    // MUI DataTable options
    const options = {
        filterType: "select",
        responsive: "scrollMaxHeight",
        print: false,
        selectableRows: "none",
        search: true,
        rowsPerPage: itemsPerPage,
        page: currentPage - 1,
        onChangePage: (page) => setCurrentPage(page + 1),
        onChangeRowsPerPage: (numberOfRows) => setItemPerPage(numberOfRows),
        fixedHeader: true, // Keep the header fixed while scrolling
        onDownload: (buildHead, buildBody, columns, data) => {
            // Filter out the "actions" column
            const filteredColumns = columns.filter((col) => col.name !== "actions");
            const filteredData = data.map((row) => {
                const newRow = { ...row };
                delete newRow.actions; // Ensure "actions" data is excluded
                return newRow;
            });

            // Generate CSV content
            const csv = buildHead(filteredColumns) + buildBody(filteredData);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            // Set the file name with the proper date format
            const pageName = "AttendanceToday"; // Use the page name as a constant
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            const fileName = `${pageName}_${formattedDate}.csv`;

            // Trigger file download
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return false; // Prevent default download behavior
        },

    };


    return (
        <MainDashboard>
            <Container>
                <Header>
                    <h2>Attendance Tracker</h2>
                    <DatePicker
                        onChange={handleDateChange}
                        value={date ? dayjs(date) : null} // Pass dayjs object to the DatePicker
                        format="YYYY-MM-DD"
                    />

                    <SearchContainer>
                        <Input
                            placeholder="Search by Franchise Name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </SearchContainer>
                </Header>

                <ButtonContainer>
                    <Button onClick={() => setShowTeachers(true)} type={showTeachers ? "primary" : "default"}>
                        Teacher Attendance
                    </Button>
                    <Button onClick={() => setShowTeachers(false)} type={!showTeachers ? "primary" : "default"}>
                        Student Attendance
                    </Button>
                </ButtonContainer>

                <Content>
                    {showTeachers && (
                        <Section>
                            <h3>Teacher Attendance</h3>
                            <ThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    data={filteredTeacherAttendance}
                                    columns={teacherColumns}
                                    options={options}
                                />
                            </ThemeProvider>
                        </Section>
                    )}

                    {!showTeachers && (
                        <Section>
                            <h3>Student Attendance</h3>
                            <TableContainer>
                                <ThemeProvider theme={getMuiTheme()}>
                                    <MUIDataTable
                                        data={studentAttendance}
                                        columns={studentColumns}
                                        options={options}
                                    />
                                </ThemeProvider>
                            </TableContainer>
                        </Section>
                    )}
                </Content>
            </Container>
        </MainDashboard>
    );
};

export default AttendancePage;

// Styled Components
const MainDashboard = styled.div`
  flex: 1;
  padding: 20px;
  width: -webkit-fill-available;
  background-color: #f9f9f9;
  box-sizing: border-box;
  height: calc(100vh - 60px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #cecece;
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #b3b3b3;
  }
`;

const Container = styled.div`
    flex: 1;
    padding: 20px;
    width: -webkit-fill-available;
    background-color: #f9f9f9;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
    h2 {
        font-size: 24px;
        color: #333;
    }
`;

const SearchContainer = styled.div`
    width: 200px;
    margin-left: 20px;
    @media (max-width: 480px) {
        margin: 0;
    }
`;

const ButtonContainer = styled.div`
    margin: 10px 0;
    display: flex;
    gap: 10px;
    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Section = styled.div`
    background: #f9f9f9;
    /* padding: 15px; */
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    h3 {
        font-size: 20px;
        color: #444;
        margin-bottom: 10px;
    }
`;

const TableContainer = styled.div`
    margin-top: 30px;
    width: 100%;
`;
