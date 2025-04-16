import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash } from "lucide-react";
import * as XLSX from "xlsx";
import { FlexColumn, Heading, Label, Label1, Option, Section, Section1, Select1 } from "../Styles/GlobalStyles";
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';  // Import MUI components for dialog

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
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #cecece;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #b3b3b3;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const StudentCard = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Photo = styled.img`
  width: 250px;
  height: 250px;
  background-color: gray;
  margin-bottom: 10px;
`;

const Name = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.color};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
  justify-content: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  margin: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
`;

const TableContainer = styled.div`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
`;

const TableRow = styled.tr``;

const TableData = styled.td`
  padding: 8px 15px;
  text-align: left;
`;

const Select = styled.select`
  margin: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 220px;
`

const AllStudent = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [franchise, setFranchise] = useState([]);
  const [itemsPerPage, setItemPerPage] = useState(8);
  const [searchStudentName, setSearchStudentName] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchStudentID, setSearchStudentID] = useState("");
  const [searchDateofAdmission, setSearchDateofAdmission] = useState("");
  const [searchState, setSearchState] = useState("");
  const [role, setRole] = useState("");
  const [openDialog, setOpenDialog] = useState(false);  // State for controlling the dialog visibility
  const [selectedStudent, setSelectedStudent] = useState(null);  // To store the student to be deleted

  useEffect(() => {
    var temp = localStorage.getItem("Role");
    setRole(temp);
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8000/student/all");
        const data = await response.json();
        if (temp === "Franchise") {
          setStudents(data.filter((student) => student.FranchiseId === localStorage.getItem("Id")));
        } else {
          setStudents(data.reverse());
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudents();
  }, []);

  const openEditPage = (student) => {
    const role = localStorage.getItem("Role");

    if (role === "Admin") {
      navigate("/admin/editstudent", { state: { StudentID: student.StudentID } });
    } else {
      alert("You are not authorized to edit this franchise.");
    }
  };

  const toggleModalview = (student) => {
    const role = localStorage.getItem("Role");

    if (role === "Admin") {
      navigate("/admin/viewstudent", {
        state: { Id: student.StudentID },
      });
    } else {
      alert("You are not authorized to view this franchise.");
    }
  };

  const filteredData = students.filter((student) => {
    return (
      (student.Name?.toLowerCase().includes(searchStudentName.toLowerCase()) ||
        !searchStudentName) &&
      (student.StudentID?.toLowerCase().includes(searchStudentID.toLowerCase()) ||
        !searchStudentID) &&
      (student.Branch?.toLowerCase().includes(searchBranch.toLowerCase()) ||
        !searchBranch) &&
      (student.DateofAdmission?.toLowerCase().includes(searchDateofAdmission.toLowerCase()) ||
        !searchDateofAdmission) &&
      (student.State?.toLowerCase().includes(searchState.toLowerCase()) ||
        !searchState)
    );
  });

  const handleDelete = async (student) => {
    try {
      const response = await fetch(`http://localhost:8000/student/delete/${student.StudentID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the student');
      }

      setStudents((prevStudents) =>
        prevStudents.filter((item) => item.StudentID !== student.StudentID)
      );

      alert('Student deleted successfully!');
      setOpenDialog(false);  // Close the dialog after deletion
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete the student');
    }
  };

  const handleOpenDialog = (student) => {
    setSelectedStudent(student);  // Set the selected student to delete
    setOpenDialog(true);  // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);  // Close the dialog
  };

  return (
    <MainDashboard>
      <Heading>All Students</Heading>
      <SearchContainer>
        <SearchInput
          placeholder="Search by Student Name"
          value={searchStudentName}
          onChange={(e) => setSearchStudentName(e.target.value)}
        />
        {role === "Admin" ? (
          <Select onChange={(e) => setSearchBranch(e.target.value)} style={{ padding: "8px", margin: "8px", borderRadius: "4px" }}>
            <Option value="" style={{ fontSize: "14px", fontWeight: "initial" }}>Select The Franchise</Option>
            {franchise?.map((cal) => (
              <Option key={cal.FranchiseID} value={cal.FranchiseName}>{cal.FranchiseName}</Option>
            ))}
          </Select>
        ) : null}
        <SearchInput
          placeholder="Search by Student ID"
          value={searchStudentID}
          onChange={(e) => setSearchStudentID(e.target.value)}
        />
        <SearchInput
          placeholder="Search by Date of Admission"
          value={searchDateofAdmission}
          onChange={(e) => setSearchDateofAdmission(e.target.value)}
        />
        <SearchInput
          placeholder="Search by State"
          value={searchState}
          onChange={(e) => setSearchState(e.target.value)}
        />
      </SearchContainer>

      <CardContainer>
        {filteredData.map((student, index) => (
          <StudentCard key={index}>
            <Photo src={`http://localhost:8000/uploads/${student.Image}`} />
            <Name>{student.Name}</Name>
            <TableContainer>
              <InfoTable>
                <tbody>
                  <TableRow>
                    <TableData><Label1>Registration Number:</Label1></TableData>
                    <TableData>{student.RegistrationNumber}</TableData>
                  </TableRow>
                  <TableRow>
                    <TableData><Label1>Student ID:</Label1></TableData>
                    <TableData>{student.StudentID}</TableData>
                  </TableRow>
                  <TableRow>
                    <TableData><Label1>Mobile No:</Label1></TableData>
                    <TableData>{student.MobileNo}</TableData>
                  </TableRow>
                  <TableRow>
                    <TableData><Label1>Course Name:</Label1></TableData>
                    <TableData>{student.Course[0].CourseName}</TableData>
                  </TableRow>
                </tbody>
              </InfoTable>
            </TableContainer>
            <div>
              <ActionButton onClick={() => toggleModalview(student)} color="#007bff">
                <Eye />
              </ActionButton>
              <ActionButton onClick={() => openEditPage(student)} color="#28a745">
                <Edit />
              </ActionButton>
              <ActionButton onClick={() => handleOpenDialog(student)} color="#dc3545">
                <Trash />
              </ActionButton>
            </div>
          </StudentCard>
        ))}
      </CardContainer>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Are you sure you want to delete this student?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(selectedStudent)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainDashboard>
  );
};

export default AllStudent;
