import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Heading, MainDashboard } from "../Styles/GlobalStyles";
import MUIDataTable from "mui-datatables";
import { IconButton } from "@mui/material";

const TableContainer = styled.div`
  font-family: Arial, sans-serif;
  margin: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0,   0, 0.1);
  border-radius: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  padding: 1rem;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
`;

const YesButton = styled.button`
  background-color: green;
  color: white;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const NoButton = styled.button`
  background-color: red;
  color: white;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`;

const AllTeacher = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const role = localStorage.getItem("Role");
  const userId = localStorage.getItem("Id");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:8000/teacher/all");
        const data = await response.json();

        if (role === "Franchise" && userId) {
          const filteredTeachers = data.reverse().filter(teacher => teacher.FranchiseId === userId);
          setTeachers(filteredTeachers);
        } else {
          setTeachers(data.reverse());
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        toast.error("Failed to load teachers.");
      }
    };

    fetchTeachers();
  }, [role, userId]);

  const openEditPage = (teacher) => {
    const role = localStorage.getItem("Role");

    if (role === "Admin") {
      navigate("/admin/editteacher", { state: { Id: teacher.TeacherID } });
    } else if (role === "Franchise") {
      navigate("/branch/editteacher", { state: { Id: teacher.TeacherID } });
    } else {
      toast.error("You are not authorized to edit this teacher.");
    }
  };

  const toggleModalview = (teacher) => {
    const role = localStorage.getItem("Role");

    if (role === "Admin") {
      navigate("/admin/viewteacher", { state: { Id: teacher.TeacherID } });
    } else if (role === "Franchise") {
      navigate("/branch/viewteacher", { state: { Id: teacher.TeacherID } });
    } else {
      toast.error("You are not authorized to view this teacher.");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(teachers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");
    XLSX.writeFile(workbook, "teachers_data.xlsx");
    toast.success("Data exported to Excel!");
  };

  const printTable = () => {
    const printContent = document.getElementById("teacher-table").outerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>All Teacher Data</title>
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
    toast.success("Table printed!");
  };

  const handleDelete = (id) => {
    setTeacherToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/teacher/delete/${teacherToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTeachers((prevTeachers) => prevTeachers.filter(teacher => teacher.TeacherID !== teacherToDelete));
        setShowModal(false);
        toast.success("Teacher deleted successfully!");
      } else {
        toast.error("Failed to delete teacher.");
      }
    } catch (error) {
      toast.error("Error deleting teacher.");
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Map over the teachers to ensure there are no undefined or null values
  const safeTeachers = filteredTeachers.map(teacher => ({
    ...teacher,
    Name: teacher.Name || "N/A",
    Email: teacher.Email || "N/A",
    Gender: teacher.Gender || "N/A",
    DOB: teacher.DOB || "N/A",
    DOJ: teacher.DOJ || "N/A",
    MobileNo: teacher.MobileNo || "N/A",
    Address: teacher.Address || "N/A",
    Salary: teacher.Salary || "N/A",
    Role: teacher.Role.join(", ") || "N/A",
  }));

  const columns = [
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const teacher = safeTeachers[tableMeta.rowIndex];
          return (
            <div>
              <IconButton onClick={() => toggleModalview(teacher)} color="primary">
                <Eye />
              </IconButton>
              <IconButton onClick={() => openEditPage(teacher)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(teacher.TeacherID)} color="secondary">
                <Trash2 />
              </IconButton>
            </div>
          );
        },
      },
    },
    {
      name: "Image", label: "Profile Image", options: {
        customBodyRender: (value, tableMeta) => {
          const teacher = safeTeachers[tableMeta.rowIndex];
          return <Image src={`http://localhost:8000/uploads/${teacher?.Image}`} alt="Teacher" />;
        }
      }
    },
    { name: "TeacherID", label: "Teacher ID" },
    { name: "Name", label: "Name" },
    { name: "FranchiseId", label: "Franchise Id" },
    { name: "FranchiseName", label: "Franchise Name" },
    { name: "Gender", label: "Gender" },
    { name: "DOB", label: "Date of Birth" },
    { name: "DOJ", label: "Date of Joining" },
    { name: "Email", label: "Email" },
    { name: "MobileNo", label: "Mobile No" },
    { name: "Address", label: "Address" },
    { name: "Salary", label: "Salary" },
    { name: "Role", label: "Role" },
  ];

  return (
    <MainDashboard>
      <TableContainer>
        <ButtonGroup>
          <Heading>All Teachers</Heading>
        </ButtonGroup>

        <Franchisetable>
          <MUIDataTable
            id="teacher-table"
            data={safeTeachers}
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
                const pageName = "AllTeachers"; // Use the page name as a constant
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

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Are you sure you want to delete this teacher?</h3>
            <YesButton onClick={confirmDelete}>Yes</YesButton>
            <NoButton onClick={cancelDelete}>No</NoButton>
          </ModalContent>
        </ModalOverlay>
      )}

      <ToastContainer />
    </MainDashboard>
  );
};

export default AllTeacher;