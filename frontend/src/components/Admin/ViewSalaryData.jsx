import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { SubmitButton, MainDashboard, Title } from "../Styles/GlobalStyles";

// Styled Components
const Container = styled.div`
    padding: 20px;
`;


const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    /* margin: 20px 0; */
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
    background-color: #ddd;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f2f2f2;
    }
    &:hover {
        background-color: #ddd;
    }
`;

const TableData = styled.td`
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    font-size: 16px;
`;

const TableHeaderCell = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    font-size: 18px;
`;

const TotalsRow = styled.tr`
    background-color: #f1f1f1;
    font-weight: bold;
`;

const Highlight = styled.span`
    color: black;
    font-weight: bold;
    font-size: 16px;
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.color};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;
  `;

const PayFelid = styled.input`
    border: none;
    border-radius: 5px;
    padding: 10px;
`;

const AttendanceTable = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [attendanceData, setAttendanceData] = useState([]);
    const [baseSalary, setBaseSalary] = useState(0);
    const [salary, setSalary] = useState("");
    const [totals, setTotals] = useState({
        present: 0,
        absent: 0,
        halfDay: 0,
        salaryTotal: 0,
    });

    const fetchAttendance = async () => {
        // console.log(location.state.Status)
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var monthNum = String(monthNames.indexOf(location.state.Month) + 1)
        try {
            const response = await axios.post(
                "https://franchiseapi.kictindia.com/staff-attendance/teacher-attendance",
                {
                    teacherId: location.state.TeacherId, // Replace with dynamic ID
                    month: monthNum, // Replace with dynamic month
                    year: location.state.Year, // Replace with dynamic year
                }
            );
            const { baseSalary, attendance } = response.data;

            setBaseSalary(baseSalary);
            setAttendanceData(attendance);

            // Calculate totals
            const calculatedTotals = attendance.reduce(
                (acc, record) => {
                    if (record.Attendance === "Present") {
                        acc.present += 1;
                        acc.salaryTotal += record.PerDay === "-" ? 0 : parseFloat(record.PerDay);
                    } else if (record.Attendance === "Absent") {
                        acc.absent += 1;
                    } else if (record.Attendance === "HalfDay") {
                        acc.halfDay += 1;
                        acc.salaryTotal += record.PerDay === "-" ? 0 : parseFloat(record.PerDay);
                    }
                    return acc;
                },
                { present: 0, absent: 0, halfDay: 0, salaryTotal: 0 }
            );
            setTotals(calculatedTotals);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handelPay = async () => {
        // const monthNames = [
        //     "January", "February", "March", "April", "May", "June",
        //     "July", "August", "September", "October", "November", "December"
        // ];
        // var monthNum = String(monthNames.indexOf(location.state.Month) + 1)
        try {
            const response = await axios.post(
                "https://franchiseapi.kictindia.com/salary/pay",
                {
                    teacherId: location.state.TeacherId, // Replace with dynamic ID
                    month: location.state.Month, // Replace with dynamic month
                    year: location.state.Year, // Replace with dynamic year
                    amount: salary,
                }
            );
            if (response.status === 200) {
                alert(response.data.message);
            
                const role = localStorage.getItem("Role");  // Get the role from local storage
            
                if (role === "Admin") {
                    // Navigate to admin's all salary page
                    navigate("/admin/allsalary");
                } else if (role === "Franchise") {
                    // Navigate to franchise's salary page (or other path based on role)
                    navigate("/branch/allsalary");  // Adjust this path as needed
                } else {
                    // Handle case for undefined or other roles (optional)
                    console.warn("Role not recognized or missing.");
                }
            }
            
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <MainDashboard>
            <Container>
                <Title>Teacher Attendance</Title>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Date</TableHeaderCell>
                            <TableHeaderCell>Day</TableHeaderCell>
                            <TableHeaderCell>Attendance</TableHeaderCell>
                            <TableHeaderCell>Rate</TableHeaderCell>
                            <TableHeaderCell>Per Day Salary</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <tbody>
                        {attendanceData.map((record, index) => (
                            <TableRow key={index}>
                                <TableData>{record.Date}</TableData>
                                <TableData>{record.Day}</TableData>
                                <TableData>{record.Attendance}</TableData>
                                <TableData>{record.Rate}</TableData>
                                <TableData>{record.PerDay}</TableData>
                            </TableRow>
                        ))}
                    </tbody>
                    <tfoot>
                        <TotalsRow>
                            <TableData colSpan="2">Totals:</TableData>
                            <TableData>
                                Present: <Highlight>{totals.present}</Highlight>
                            </TableData>
                            <TableData>
                                Absent: <Highlight>{totals.absent}</Highlight>
                            </TableData>
                            <TableData>
                                HalfDay: <Highlight>{totals.halfDay}</Highlight>
                            </TableData>
                        </TotalsRow>
                        <TotalsRow>
                            <TableData colSpan="4">Base Salary:</TableData>
                            <TableData>
                                <Highlight>{baseSalary}</Highlight>
                            </TableData>
                        </TotalsRow>
                        <TotalsRow>
                            <TableData colSpan="4">Total Salary:</TableData>
                            <TableData>
                                <Highlight>{totals.salaryTotal}</Highlight>
                            </TableData>
                        </TotalsRow>
                        <TotalsRow>
                            <TableData colSpan="4">Paid Amount:</TableData>
                            <TableData>
                                <Highlight>{location.state?.PaidAmount ?? "-"}</Highlight>
                            </TableData>
                        </TotalsRow>
                        <TotalsRow>
                            <TableData colSpan="4">Status:</TableData>
                            <TableData>
                                <Highlight>{(location.state.Status)}</Highlight>
                            </TableData>
                        </TotalsRow>
                        {location.state.Status === "Unpaid" ?
                            <TotalsRow>
                                <TableData colSpan="2">Pay Salary</TableData>
                                <TableData colSpan="2">
                                    <PayFelid type="text" placeholder="Enter Salary ₹" value={salary} onChange={(e) => setSalary(e.target.value)} />
                                </TableData>
                                <TableData>
                                    <ActionButton
                                        color="green"
                                        onClick={handelPay}
                                    >
                                        Pay
                                    </ActionButton>
                                </TableData>
                            </TotalsRow>
                            : null}
                    </tfoot>
                </Table>
            </Container>
        </MainDashboard>
    );
};

export default AttendanceTable;
