import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input, Input2, InputContainer, Label, Main1, MainDashboard, Select1, SubmitButton, Title } from "../Styles/GlobalStyles";


const Wrapper = styled.div`
  width: 80%;
  margin: 20px auto;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #fff;
`;

const HeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 14px;
  color: #666;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
`;

const TableBody = styled.tbody`
  color: black;
`;

const BodyCell = styled.td`
  padding: 12px;
  text-align: left;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
`;

const StatusContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const StatusButtonP = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 55%;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

const StatusButtonA = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 55%;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

const StudentAttendance = () => {
    const [attendanceData, setAttendanceData] = useState({});
    const [selectedDate, setSelectedDate] = useState("");
    const [statusSelection, setStatusSelection] = useState({});
    const [franchises, setFranchises] = useState([]);
    const [batches, setBatches] = useState([]);
    const [slots, setSlots] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedFranchise, setSelectedFranchise] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");

    // Fetch franchises when component mounts
    useEffect(() => {
        var temp = localStorage.getItem("Role");

        const fetchFranchises = async () => {
            try {
                const response = await fetch("https://franchiseapi.kictindia.com/franchise/all");
                const data = await response.json();
                if (temp == "Franchise") {
                    var id = localStorage.getItem("Id");
                    var selectFran = data.find(val => val.FranchiseID == id);
                    setFranchises([selectFran])
                    setSelectedFranchise(selectFran.FranchiseID)
                } else if (temp == "Teacher") {
                    var id = JSON.parse(localStorage.getItem("TeacherData"));
                    var selectFran = data.find(val => val.FranchiseID == id.FranchiseId);
                    setFranchises([selectFran])
                    setSelectedFranchise(selectFran.FranchiseID)
                } else {
                    setFranchises(data);
                }
            } catch (error) {
                console.error("Error fetching franchises:", error);
            }
        };
        fetchFranchises();
    }, []);

    // Fetch batches when franchise is selected
    useEffect(() => {
        // console.log(selectedFranchise)
        if (selectedFranchise) {
            const fetchBatches = async () => {
                try {
                    const response = await axios.get(`https://franchiseapi.kictindia.com/batch/get/franchise/${selectedFranchise}`);
                    console.log(response.data)
                    setBatches(response.data.Batch);  // Assuming the data returns batches as an array
                } catch (error) {
                    console.error("Error fetching batches:", error);
                }
            };
            fetchBatches();
        } else {
            setBatches([]);
        }
    }, [selectedFranchise]);

    // Fetch slots when batch is selected
    useEffect(() => {
        if (selectedBatch) {
            // console.log(selectedBatch)
            const fetchSlots = () => {
                const batch = batches.find(batch => batch._id === selectedBatch);
                if (batch) {
                    setSlots(batch.Slots);
                }
            };
            fetchSlots();
        } else {
            setSlots([]);
        }
    }, [selectedBatch, batches]);

    // Fetch students when slot is selected
    useEffect(() => {
        if (selectedSlot) {
            const fetchStudents = () => {
                const batch = batches.find(batch => batch._id === selectedBatch);
                if (batch) {
                    const slot = batch.Slots.find(slot => slot._id === selectedSlot);
                    if (slot) {
                        setStudents(slot.Students);

                        // Set initial attendance data
                        const initialStatus = {};
                        const attendanceInfo = {};
                        slot.Students.forEach(student => {
                            initialStatus[student.StudentId] = "Present"; // Default to Present
                            attendanceInfo[student.StudentId] = {
                                Status: "Present",
                                Name: student.StudentName,
                            };
                        });

                        setStatusSelection(initialStatus);
                        setAttendanceData(attendanceInfo);
                    }
                }
            };
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedSlot, selectedBatch, batches]);

    // Handle changing attendance status
    const handleStatusChange = (studentId, status) => {
        setStatusSelection(prev => ({
            ...prev,
            [studentId]: status,
        }));

        // Get the student's name from the students list
        const studentName = students.find(student => student.StudentId === studentId)?.StudentName;

        setAttendanceData(prev => ({
            ...prev,
            [studentId]: {
                Status: status,
                Name: studentName,  // Store the student's name here
            },
        }));
    };


    // Handle form submission

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all required fields
        if (!selectedDate || !selectedFranchise || !selectedBatch || !selectedSlot) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Find the batch data that corresponds to the selectedBatch
        const selectedBatchData = batches.find(batch => batch._id === selectedBatch);
        if (!selectedBatchData) {
            toast.error("Selected batch data is not available.");
            return;
        }

        // Find the slot data for the selected slot within the selected batch
        const selectedSlotData = selectedBatchData.Slots.find(slot => slot._id === selectedSlot);
        if (!selectedSlotData) {
            toast.error("Selected slot data is not available.");
            return;
        }

        const attendanceToSubmit = {
            Date: selectedDate,
            Course: selectedFranchise, // Assuming franchise is the course
            Batch: {
                Hour: selectedBatchData?.Hour, // Batch hour (e.g., "1 Hour", "2 Hours")
                Name: selectedSlotData?.SlotTime, // Batch name
            },
            Attendance: students.map(student => ({
                StudentId: student.StudentId,
                Name: attendanceData[student.StudentId]?.Name,  // The Name is now part of attendanceData
                Status: attendanceData[student.StudentId]?.Status,
                InTime: attendanceData[student.StudentId]?.InTime || null, // InTime can be null if not provided
                OutTime: attendanceData[student.StudentId]?.OutTime || null // OutTime can be null if not provided
            })),
        };

        console.log(attendanceToSubmit)

        try {
            // Sending the request to the backend
            const response = await axios.post('https://franchiseapi.kictindia.com/student-attendance/add', attendanceToSubmit);

            // Success - Show message and reset the form
            toast.success("Attendance submitted successfully!");

            // Clear state after successful submission
            setSelectedDate("");
            setSelectedFranchise("");
            setSelectedBatch("");
            setSelectedSlot("");
            setAttendanceData({}); // Ensure this resets to the default structure
            setStatusSelection({});
            setStudents([]);
        } catch (error) {
            // Error handling
            console.error("Error submitting attendance:", error);
            toast.error(error.response?.data?.message || "Error submitting attendance. Please try again.");
        }
    };

    useEffect(() => {
        const today = new Date();
        // Format the date in YYYY-MM-DD format
        const formattedDate = today.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
    }, []);



    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };


    const today = new Date().toISOString().split("T")[0];

    return (
        <MainDashboard>
            <Title>Choose Student Attendance Type</Title>
            <ToastContainer />
            <Main1>

                <InputContainer>
                    <Label htmlFor="date">Date</Label>
                    <Input2
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        max={selectedDate}  // Prevent future dates
                    />
                </InputContainer>
                <InputContainer>
                    <Label>Franchise:</Label>
                    <Select1
                        value={selectedFranchise}
                        onChange={(e) => setSelectedFranchise(e.target.value)}
                    >
                        <option value="">Select a Franchise</option>
                        {franchises.map(franchise => (
                            <option key={franchise.FranchiseID} value={franchise.FranchiseID}>
                                {franchise.FranchiseName}
                            </option>
                        ))}
                    </Select1>
                </InputContainer>
                <InputContainer>
                    <Label>Batch:</Label>
                    <Select1
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        <option value="">Select a Batch</option>
                        {batches.map(batch => (
                            <option key={batch._id} value={batch._id}>
                                {batch.Hour}
                            </option>
                        ))}
                    </Select1>
                </InputContainer>
                <InputContainer>
                    <Label>Slot:</Label>
                    <Select1
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                    >
                        <option value="">Select a Slot</option>
                        {slots.map(slot => (
                            <option key={slot._id} value={slot._id}>
                                {slot.SlotTime}
                            </option>
                        ))}
                    </Select1>
                </InputContainer>
            </Main1>

            <Wrapper>
                <Title>Students</Title>
                <StyledTable>
                    <TableHeader>
                        <tr>
                            <HeaderCell>Id</HeaderCell>
                            <HeaderCell>Student Name</HeaderCell>
                            <HeaderCell>Status</HeaderCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.StudentId}>
                                    <BodyCell>{student.StudentId}</BodyCell>
                                    <BodyCell>{student.StudentName}</BodyCell>
                                    <BodyCell>
                                        <StatusContainer>
                                            <StatusButtonP onClick={() => handleStatusChange(student.StudentId, "Present")}
                                                style={{
                                                    backgroundColor: attendanceData[student.StudentId]?.Status === "Present" ? "#4caf50" : "#e0e0e0",
                                                }}>
                                                P
                                            </StatusButtonP>
                                            <StatusButtonA onClick={() => handleStatusChange(student.StudentId, "Absent")}
                                                style={{
                                                    backgroundColor: attendanceData[student.StudentId]?.Status === "Absent" ? "#f44336" : "#e0e0e0",
                                                }}>
                                                A
                                            </StatusButtonA>
                                        </StatusContainer>
                                    </BodyCell>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No students found</td>
                            </tr>
                        )}
                    </TableBody>
                </StyledTable>
            </Wrapper>

            <div>
                <SubmitButton onClick={handleSubmit}>Submit Attendance</SubmitButton>
            </div>



        </MainDashboard>
    );
};

export default StudentAttendance;

