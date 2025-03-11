import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Importing Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importing toast styles
import { Input, Input2, InputContainer, Label, Main, Main1, MainDashboard, Select1, SubmitButton, Title } from "../Styles/GlobalStyles";

// Styled Components (no changes)
const Wrapper = styled.div`
  width: 80%;
  margin: 20px auto;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

const TeacherAttendance = () => {
    const [allStaff, setAllStaff] = useState([]); // All staff data
    const [filteredStaff, setFilteredStaff] = useState([]); // Filtered staff based on FranchiseName
    const [selectedDate, setSelectedDate] = useState("");
    const [FranchiseNames, setFranchiseNames] = useState([]); // List of all franchises
    const [attendanceData, setAttendanceData] = useState({});
    const [formData, setFormData] = useState({ FranchiseName: "", FranchiseId: "" }); // Include FranchiseId
    const [statusSelection, setStatusSelection] = useState({}); // Track selected statuses
    const [role, setRole] = useState("");



    // Fetch FranchiseNames once when the component mounts
    useEffect(() => {
        const fetchFranchiseNames = async () => {
            try {
                const response = await axios.get("https://franchiseapi.kictindia.com/franchise/all");
                var temp = localStorage.getItem("Role");
                setRole(temp)
                if (temp === "Franchise") {
                    let data = JSON.parse(localStorage.getItem("FranchiseData"));
                    setFormData({ ...formData, FranchiseName: data.FranchiseName, FranchiseId: data.FranchiseID })
                    console.log(JSON.parse(data))
                    setFranchiseNames([data]); // Set franchise names for dropdown
                } else {
                    setFranchiseNames(response.data); // Set franchise names for dropdown
                }
                setFranchiseNames(response.data); // Set franchise names for dropdown
            } catch (error) {
                console.error("Error fetching FranchiseNames:", error);
            }
        };
        fetchFranchiseNames();
    }, []);

    // Fetch all staff data
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get("https://franchiseapi.kictindia.com/teacher/all");
                setAllStaff(response.data);
                console.log(response.data) // Store all staff data
            } catch (error) {
                console.error("Error fetching staff:", error);
            }
        };
        fetchStaff();
    }, []);

    // Filter staff based on selected FranchiseName
    useEffect(() => {
        if (formData.FranchiseName) {
            const filtered = allStaff.filter(
                (staff) => staff.FranchiseName === formData.FranchiseName
            );
            setFilteredStaff(filtered);
        } else {
            setFilteredStaff([]); // If no franchise is selected, clear the filtered list
        }
    }, [formData.FranchiseName, allStaff]);


    useEffect(() => {
        const initialStatus = {};
        filteredStaff.forEach((staff) => {
            initialStatus[staff.TeacherId] = "Present"; // Set default status to "Present"
        });
        setStatusSelection(initialStatus);
    }, [filteredStaff]);

    // Update form data when franchise name is selected
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the form data with both FranchiseName and FranchiseId
        if (name === "FranchiseName") {
            const selectedFranchise = FranchiseNames.find(franchise => franchise.FranchiseName === value);
            setFormData({
                ...formData,
                [name]: value,
                FranchiseId: selectedFranchise ? selectedFranchise.FranchiseID : ""
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    useEffect(() => {
        const fetchExistingData = async () => {
            if (selectedDate && formData.FranchiseId) {
                try {
                    const response = await axios.post("https://franchiseapi.kictindia.com/staff-attendance/get/franchise-date", {
                        franchiseId: formData.FranchiseId,
                        date: selectedDate
                    });
                    if (response.data && response.data.Attendance) {
                        // Map the fetched attendance data to be used in the table
                        const existingAttendance = response.data.Attendance.reduce((acc, curr) => {
                            acc[curr.TeacherId] = {
                                Status: curr.Status,
                                Name: curr.Name,
                                _id: curr._id // Store the _id for updating later
                            };
                            return acc;
                        }, {});
                        setAttendanceData(existingAttendance); // Update state with the fetched attendance data
                    } else {
                        // If no existing attendance data, set it as empty (or default statuses)
                        const newAttendance = {};
                        filteredStaff.forEach((staff) => {
                            newAttendance[staff.TeacherId] = { Status: "Present", Name: staff.Name }; // Default status
                        });
                        setAttendanceData(newAttendance);
                    }
                } catch (error) {
                    console.error(error);
                    const newAttendance = {};
                    filteredStaff.forEach((staff) => {
                        newAttendance[staff.TeacherId] = { Status: "Present", Name: staff.Name }; // Default status
                    });
                    setAttendanceData(newAttendance);
                }
            }
        }

        fetchExistingData();
    }, [selectedDate, formData.FranchiseId])

    const handleStatusChange = (TeacherID, Name, status) => {
        setAttendanceData((prev) => ({
            ...prev,
            [TeacherID]: { ...prev[TeacherID], Status: status, Name },

        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !formData.FranchiseName) {
            alert("Please fill in all required fields");
            return;
        }

        console.log(attendanceData)
        const attendanceToSubmit = {
            Date: selectedDate,
            FranchiseName: formData.FranchiseName,
            FranchiseId: formData.FranchiseId, // Include FranchiseId in the submission
            Attendance: Object.keys(attendanceData).map((TeacherID) => ({
                TeacherId: TeacherID,
                Name: attendanceData[TeacherID].Name,
                Status: attendanceData[TeacherID].Status,
            })),
        };

        console.log(attendanceToSubmit)

        try {
            const response = await axios.put("https://franchiseapi.kictindia.com/staff-attendance/update", attendanceToSubmit);
            console.log("Attendance submitted:", response.data);
            setSelectedDate("");
            setFormData({ FranchiseName: "", FranchiseId: "" });
            setAttendanceData({});
            setStatusSelection({});
            toast.success("Attendance submitted successfully!");
        } catch (error) {
            console.error("Error submitting attendance:", error);
            toast.error(error.response.data.message || "Error submitting attendance!");
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

    return (
        <MainDashboard>
            <Title>Teacher Attendance</Title>
            <ToastContainer />
            {/* <Form> */}
            <Main1>
                {role !== "Franchise" ?
                    <InputContainer>
                        <Label htmlFor="franchiseName">Franchise Name</Label>
                        <Select1
                            id="franchiseName"
                            name="FranchiseName"
                            value={formData.FranchiseName}
                            onChange={handleChange}
                        >
                            <option value="">Select Franchise</option>
                            {FranchiseNames.map((franchise) => (
                                <option key={franchise.FranchiseId} value={franchise.FranchiseName}>
                                    {franchise.FranchiseName}
                                </option>
                            ))}
                        </Select1>
                    </InputContainer>
                    : null}


                <InputContainer>
                    <Label htmlFor="date">Date</Label>
                    <Input2
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                    // max={selectedDate}  // Prevent future dates
                    />
                </InputContainer>
            </Main1>

            <Wrapper>
                <StyledTable>
                    <TableHeader>
                        <tr>
                            <HeaderCell>Teacher Name</HeaderCell>
                            <HeaderCell>Attendance Status</HeaderCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {console.log(filteredStaff)}
                        {filteredStaff.map((staff) => (
                            <tr key={staff.TeacherID}>
                                <BodyCell>{staff.Name}</BodyCell>
                                <BodyCell>
                                    <StatusContainer>
                                        <StatusButtonP
                                            onClick={() => handleStatusChange(staff.TeacherID, staff.Name, "Present")}
                                            style={{
                                                backgroundColor: attendanceData[staff.TeacherID]?.Status === "Present" ? "#4caf50" : "#e0e0e0",
                                            }}
                                        >
                                            P
                                        </StatusButtonP>
                                        <StatusButtonA
                                            onClick={() => handleStatusChange(staff.TeacherID, staff.Name, "Absent")}
                                            style={{
                                                backgroundColor: attendanceData[staff.TeacherID]?.Status === "Absent" ? "#f44336" : "#e0e0e0",
                                            }}
                                        >
                                            A
                                        </StatusButtonA>
                                        <StatusButtonA
                                            onClick={() => handleStatusChange(staff.TeacherID, staff.Name, "HalfDay")}
                                            style={{
                                                backgroundColor: attendanceData[staff.TeacherID]?.Status === "HalfDay" ? "#ffd000" : "#e0e0e0",
                                            }}
                                        >
                                            HD
                                        </StatusButtonA>
                                    </StatusContainer>
                                </BodyCell>
                            </tr>
                        ))}
                    </TableBody>
                </StyledTable>
            </Wrapper>

            <SubmitButton onClick={handleSubmit}>Submit Attendance</SubmitButton>
            {/* </Form> */}
        </MainDashboard>
    );
};

export default TeacherAttendance;

