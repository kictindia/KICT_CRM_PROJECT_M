import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, CheckCheck } from "lucide-react";
import { SiMicrosoftexcel } from "react-icons/si";
import { IoMdPrint } from "react-icons/io";
import * as XLSX from "xlsx";
import axios from "axios";
import { Heading } from "../Styles/GlobalStyles";
import MUIDataTable from "mui-datatables";
import { IconButton } from "@mui/material";

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

const Input = styled.input`
  width: 88%;
  padding: 15px 20px;
  border: 2px solid #7130E4;
  border-radius: 30px;
  font-size: 16px;
  color: #7a7a7a;
  background-color: #f4f6fc;
  font-weight: bold;
  outline: none;
  @media (max-width: 480px) {
    height: 10px;
    width: 80%;
    font-size: 12px;
    padding: 12px 18px;
  }
`;

const TableContainer = styled.div`
  font-family: Arial, sans-serif;
  margin: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  padding: 1rem ;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  width: 30%;
  font-size: 18px;
  @media(max-width: 450px){
    width: 60%;
  }
`;

const OpenButton = styled(Button)`
  background-color: #3330e4;
`;

const Franchisetable = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-weight: 400;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  background-color: gray;
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.color};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
`;

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  color: #888;
`;

const PaginationButton = styled.button`
  background-color: #fff;
  color: ${(props) => (props.disabled ? "#ccc" : "#000")};
  border: none;
  padding: 5px 15px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 14px;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#fff" : "#f0f0f0")};
  }
`;

const RowsPerPageDropdown = styled.select`
  margin: 0 10px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 14px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
`;

const ButtonSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  gap: 0.5px;
  button {
    border: none;
    background: transparent;
    font-size: 25px;
    padding: 5px;
  }
`;

const SearchInput = styled.input`
  margin: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
`;


const PendingStudent = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(8);

  // Search state variables for student attributes
  const [searchStudentName, setSearchStudentName] = useState("");
  const [searchRegistrationNumber, setSearchRegistrationNumber] = useState("");
  const [searchMobileNo, setSearchMobileNo] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchBranch, setSearchBranch] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await fetch("https://franchiseapi.kictindia.com/pending-student/all");
      const data = await response.json();
      setStudents(data.reverse());
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const openEditPage = async (student) => {
    console.log(student);
    try {
      const response = await axios.post("https://franchiseapi.kictindia.com/student/add-from-pending", student);
      console.log(response.data)
      if (response.status === 201) {
        alert("Student Approved Successfully!");
        fetchStudents();
      } else {
        alert("Failed to add course. Please try again.");
      }
    } catch (error) {
      console.error("There was an error adding the course:", error);
      alert("Error occurred while adding the course.");
    }
  };



  // Function to handle navigating to the view page
  const toggleModalview = (student) => {
    console.log(student)
    const role = localStorage.getItem("Role");

    // Only Admin can view the franchise details
    if (role === "Admin") {
      navigate("/admin/view-pending-student", {
        state: { Id: student.StudentID },
      });
    } else {
      // Optionally, show an alert or handle this case
      alert("You are not authorized to view this Student.");
      // Redirect the user to another page if necessary
    }
  };


  const totalPages = Math.ceil(students.length / itemsPerPage);
  const currentData = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students_data.xlsx");
  };

  const printTable = () => {
    const printContent = document.getElementById("student-table").outerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>All Student Data</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const filteredData = students.filter((student) => {
    return (
      (student.Name?.toLowerCase().includes(searchStudentName.toLowerCase()) ||
        !searchStudentName) &&
      (student.RegistrationNumber?.toLowerCase().includes(searchRegistrationNumber.toLowerCase()) ||
        !searchRegistrationNumber) &&
      (student.MobileNo?.toLowerCase().includes(searchMobileNo.toLowerCase()) ||
        !searchMobileNo) &&
      (student.Email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
        !searchEmail) &&
      (student.Branch?.toLowerCase().includes(searchBranch.toLowerCase()) || // Branch filter logic
        !searchBranch)
    );
  });

  const columns = [
    { name: "Name", label: "Name" },
    { name: "RegistrationNumber", label: "Registration No" },
    {
      name: "MobileNo",
      label: "Mobile No",
      options: {
        customBodyRender: (value) => {
          if (!value) return "N/A"; // Handle missing values
          // Format the mobile number (e.g., add spaces or country code)
          return value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"); // Format as xxx-xxx-xxxx
        },
      },
    },
    { name: "Email", label: "Email" },
    {
      name: "DateofAdmission",
      label: "Date of Admission",
      options: {
        customBodyRender: (value) => {
          if (!value) return "N/A"; // Handle missing values
          // Format the date (e.g., DD-MM-YYYY)
          const date = new Date(value);
          return date.toLocaleDateString("en-GB"); // Formats as DD/MM/YYYY
        },
      },
    },
    { name: "Branch", label: "Branch" },
    { name: "Gender", label: "Gender" },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const student = students[tableMeta.rowIndex];
          return (
            <div>
              <IconButton onClick={() => toggleModalview(student)} color="primary">
                <Eye />
              </IconButton>
              <IconButton onClick={() => openEditPage(student)} style={{ color: "#28a745" }}>
                <CheckCheck />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];


  return (
    <MainDashboard>
      <TableContainer>
        <ButtonGroup>
          <Heading>Pending Students</Heading>
        </ButtonGroup>



        <Franchisetable>
          <MUIDataTable
            id="student-table"
            data={students}
            columns={columns}
            options={{
              filterType: "select",
              responsive: "scrollMaxHeight",
              print: false,
              selectableRows: "none",
              search: true,
              rowsPerPage: itemsPerPage,
              page: currentPage - 1,
              onChangePage: (page) => setCurrentPage(page + 1),
              onChangeRowsPerPage: (numberOfRows) => setItemPerPage(numberOfRows),
              onDownload: (buildHead, buildBody, columns, data) => {
                // Filter out the "actions" column
                const filteredColumns = columns.filter((col) => col.name !== "actions");
                
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
                const pageName = "PendingStudents"; // Use the page name as a constant
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
              
            }}
          />
        </Franchisetable>

      </TableContainer>
    </MainDashboard>
  );
};

export default PendingStudent;

