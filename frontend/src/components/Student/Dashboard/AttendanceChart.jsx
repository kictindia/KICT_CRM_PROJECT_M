import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';

// Register the required chart.js components
Chart.register(ArcElement, Tooltip, Legend);

// Styled Components
const Container = styled.div`
  margin: 20px auto;
  display: flex;
  gap: 3rem;
  @media (max-width:768px){
    flex-direction:column;
    gap:2rem;
    align-items: center;
    width: auto;
  }
`;

const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 45%;
  @media (max-width:480px){
   width: 80%;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title1 = styled.h4`
  font-size: 20px;
  color: #1a237e;
`;

const Section = styled.div`
  display: flex;
  gap: 5px;
  button {
    border-radius: 5px;
    border: 0.5px solid;
    background-color: transparent;
    padding: 2px 8px;
    color: black;
  }
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #666;
`;

const TableContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableHeader = styled.th`
  background-color: #f2f2f2;
  padding: 12px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  font-size: 14px;
`;

const TableData = styled.td`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 12px;
`;


const AttendanceChart = () => {
    const [studentAttendance, setStudentAttendance] = useState([]);
    const [presentCount, setPresentCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);

    const studentId = localStorage.getItem('Id'); // Get the logged-in student's ID from localStorage

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/student-attendance/all");

                // Filter attendance data for the logged-in student
                const studentAttendanceData = response.data.map(batch => {
                    const studentAttendanceForBatch = batch.Attendance.filter(att => att.StudentId === studentId);
                    if (studentAttendanceForBatch.length > 0) {
                        return {
                            batch: batch.Batch.Name,
                            date: batch.Date,
                            status: studentAttendanceForBatch[0].Status
                        };
                    }
                    return null;
                }).filter(item => item !== null);

                setStudentAttendance(studentAttendanceData);

                // Count the number of Present and Absent statuses
                const present = studentAttendanceData.filter(item => item.status === 'Present').length;
                const absent = studentAttendanceData.filter(item => item.status === 'Absent').length;

                setPresentCount(present);
                setAbsentCount(absent);
                
                console.log("Student Attendance:", studentAttendanceData);
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            }
        };

        fetchAttendanceData();
    }, []);

    // Attendance Doughnut chart data
    const doughnutData = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                label: 'Attendance Status',
                data: [presentCount, absentCount], // Use the present and absent counts
                backgroundColor: ['#64b5f6', '#f06292'],
                hoverOffset: 4,
            },
        ],
    };

    // Attendance table columns and rows
    const attendanceColumns = ['Date', 'Batch', 'Status'];
    const attendanceRows = studentAttendance.map(att => [att.date, att.batch, att.status]);

    return (
        <Container>
            <Card>
                <TitleWrapper>
                    <Title1>Attendance Status</Title1>
                    <Section>
                        <button onClick={() => downloadPDF('Attendance Status', attendanceColumns, attendanceRows)}>PDF</button>
                        <button className='blue' onClick={() => downloadCSV([attendanceColumns, ...attendanceRows], 'Attendance_Status')}>CSV</button>
                        <button className='green' onClick={() => downloadExcel([attendanceColumns, ...attendanceRows], 'Attendance_Status')}>Excel</button>
                    </Section>
                </TitleWrapper>
                <Doughnut data={doughnutData} />
                <Subtitle>
                    <span style={{ color: '#64b5f6' }}>●</span> Present &nbsp;&nbsp;
                    <span style={{ color: '#f06292' }}>●</span> Absent
                </Subtitle>
            </Card>

            {/* Attendance Table */}
            <Card>
                <TitleWrapper>
                    <Title1>Attendance Records</Title1>
                </TitleWrapper>
                <TableContainer>

                <Table>
                    <thead>
                        <tr>
                            <TableHeader>Date</TableHeader>
                            <TableHeader>Batch</TableHeader>
                            <TableHeader>Status</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceRows.length > 0 ? (
                            attendanceRows.map((row, index) => (
                                <tr key={index}>
                                    <TableData>{row[0]}</TableData>
                                    <TableData>{row[1]}</TableData>
                                    <TableData>{row[2]}</TableData>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3">No attendance records available.</td></tr>
                        )}
                    </tbody>
                </Table>
                </TableContainer>
            </Card>
        </Container>
    );
};

// Function to download CSV
const downloadCSV = (data, filename) => {
    const csvData = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
};

// Function to download Excel
const downloadExcel = (data, filename) => {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Function to download PDF
const downloadPDF = (title, columns, rows) => {
    const doc = new jsPDF();
    doc.text(title, 20, 10);
    doc.autoTable({
        head: [columns],
        body: rows,
    });
    doc.save(`${title}.pdf`);
};

export default AttendanceChart;
