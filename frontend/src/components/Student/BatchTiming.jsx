import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import MUIDataTable from "mui-datatables";
import { Button } from '@mui/material';

const MainDashboard = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding: 20px;
  width:  -webkit-fill-available;
  background-color: #f9f9f9;
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

const TableContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: auto;
`;

const BatchTiming = () => {
    const [studentData, setStudentData] = useState(null);
    const studentId = localStorage.getItem('Id'); // Get studentId from localStorage

    // Fetch student data based on studentId
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/student/get/${studentId}`);
                setStudentData(response.data); // Store student data
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]);

    // Data transformation to fit MUI DataTable format
    const tableData = studentData?.Course?.map(course => [
        course.CourseName,
        course.CourseDuration,
        course.Slot,
        course.Hour,
    ]) || [];

    const columns = [
        { name: "Course Name", label: "Course Name" },
        { name: "Duration", label: "Duration" },
        { name: "Slot", label: "Slot" },
        { name: "Timing", label: "Timing" },
    ];

    const options = {
        filterType: "select",
        responsive: "standard",
        elevation: 1,
        selectableRows: "none",
        pagination: true,
        rowsPerPageOptions: [5, 10, 15],
        textLabels: {
            body: {
                noMatch: "No records found",
                toolTip: "Sort",
                columnHeaderTooltip: column => `Sort for ${column.label}`,
            },
        },
    };

    return (
        <MainDashboard>
            <TableContainer>
                {studentData ? (
                    <>
                        <h2>Batch Timings</h2>
                        <MUIDataTable
                            title={"Course Details"}
                            data={tableData}
                            columns={columns}
                            options={options}
                        />
                    </>
                ) : (
                    <p>Loading student data...</p>
                )}
            </TableContainer>
        </MainDashboard>
    );
};

export default BatchTiming;
