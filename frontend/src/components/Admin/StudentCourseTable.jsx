import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MUIDataTable from "mui-datatables";
import { useNavigate } from 'react-router-dom';
import { MainDashboard, SubmitButton1 } from '../Styles/GlobalStyles';
import styled from 'styled-components';

const Header = styled.h1`
    text-align: center;
    margin-bottom: 20px;
    font-size: 28px;

    @media (max-width: 768px) {
        font-size: 24px;
    }

    @media (max-width: 480px) {
        font-size: 20px;
    }
`;

const StudentCourseTable = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [certificateList, setCertificateList] = useState([]);

    // Fetch student data
    useEffect(() => {
        axios.get('http://localhost:8000/student/all')
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching the student data:', error);
            });
    }, []);

    // Fetch certificates data
    useEffect(() => {
        axios.get('http://localhost:8000/certificates/all')
            .then(response => {
                setCertificateList(response.data);
            })
            .catch(error => {
                console.error('Error fetching the certificate data:', error);
            });
    }, []);

    // Handle adding marks (this is just for demonstration)
    const handleAddMarks = (studentId, courseId, franchiseId) => {
        var role = localStorage.getItem("Role");
        if (role === "Admin") {
            navigate("/admin/add-certificate", { state: { studentId, courseId, franchiseId } });
        }
    };

    // Prepare data for MUI DataTable
    const data = students.map(student => {
        return student.Course.map((course, index) => {
            const certificate = certificateList.find(cert =>
                cert.StudentId === student.StudentID && cert.CourseId === course.CourseId
            );
            return [
                student.StudentID,
                student.Name,
                course.CourseName,
                course.CourseDuration,
                !certificate ? (
                    <SubmitButton1 onClick={() => handleAddMarks(student.StudentID, course.CourseId, student.FranchiseId)}>
                        Add Marks
                    </SubmitButton1>
                ) : (
                    <span>Marks Added</span>
                ),
            ];
        });
    }).flat(); // Flatten the array of courses to a single array of data

    // Define the columns for MUIDataTable
    const columns = [
        { name: "Student ID", options: { filter: true, sort: true } },
        { name: "Student Name", options: { filter: true, sort: true } },
        { name: "Course Name", options: { filter: true, sort: true } },
        { name: "Course Duration", options: { filter: true, sort: true } },
        { name: "Action", options: { filter: false, sort: false } },
    ];

    // MUI DataTable options
    const options = {
        filterType: 'select',
        responsive: 'scrollMaxHeight',
        rowsPerPage: 10,
        selectableRows: 'none',
        setTableHeadProps: {
            style: {
                textAlign: 'center', // Center the table header
            },
        },
        setTableBodyRowProps: {
            style: {
                textAlign: 'center', // Center the table body cells
            },
        },
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <div style={{ textAlign: 'center' }}>
                    {value}
                </div>
            );
        },
        onDownload: (buildHead, buildBody, columns, data) => {
            // Filter out the "actions" column
            const filteredColumns = columns.filter((col) => col.name !== "Action");

            // Generate headers from the filtered columns
            const headers = filteredColumns.map((col) => col.label);

            // Map the data to match the filtered columns
            const rows = data.map((row) => {
                return filteredColumns.map((col) => {
                    const field = col.name;
                    return row.data.find((item, index) => index === columns.findIndex(c => c.name === field)) || "";
                });
            });

            // Build CSV content
            const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

            // Create a Blob for the CSV content
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            // Set the file name
            const pageName = "Certificates"; // Use the page name as a constant
            const today = new Date();
            const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
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
            <Header>Student Course Enrollment</Header>
            <MUIDataTable
                data={data}
                columns={columns}
                options={options}
            />
        </MainDashboard>
    );
};

export default StudentCourseTable;
