import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import { SiMicrosoftexcel } from "react-icons/si";
import { IoMdPrint } from "react-icons/io";
import * as XLSX from "xlsx";
import axios from "axios";
import FollowUpPagePop from "./FollowUpPageCard";
import { Heading } from "../Styles/GlobalStyles";
import MUIDataTable from "mui-datatables";
import { IconButton } from "@mui/material";

const MainDashboard = styled.div`
  flex: 1;
  padding: 20px;
  width:  -webkit-fill-available;
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
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-weight: 400;
  `;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const Textarea = styled.textarea`
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ddd;
  min-height: 100px;
`;

const ModalButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  width: 50%;
`;

const CloseButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  width: 50%;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  max-height: 700px;
  overflow-y: auto;
`;

const PopupHeader = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const PopupCloseButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  float: right;
`;

const PopupBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FollowUpPage = () => {
  const navigate = useNavigate();
  const [franchises, setFranchises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(5);

  // Search state variables for franchise
  const [searchFranchiseName, setSearchFranchiseName] = useState("");
  const [searchOwnerName, setSearchOwnerName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchMobileNo, setSearchMobileNo] = useState("");
  const [searchFranchiseId, setSearchFranchiseId] = useState("");
  const [searchState, setSearchState] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [enquiryNo, setEnquiryNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [followUpData, setFollowUpData] = useState({
    EnquiryNo: "",
    Name: "",
    FranchiseName: "",
    MobileNo: "",
    AMobileNo: "",
    Message: "",
    Course: "",
  });
  const [role, setRole] = useState("");

  const fetchFranchises = async (temp) => {
    try {
      const response = await fetch("https://franchiseapi.kictindia.com/followups/all");
      const data = await response.json();
      console.log(data)
      if (temp == "Franchise") {
        setFranchises(data.filter((item) => item.FranchiseId == localStorage.getItem("Id")))
      } else {
        setFranchises(data.reverse());
      }
      // console.log(data);
    } catch (error) {
      console.error("Error fetching franchise data:", error);
    }
  };
  useEffect(() => {
    var temp = localStorage.getItem("Role");
    setRole(temp)
    fetchFranchises(temp);
  }, []);

  // Function to handle navigating to the edit page
  const openEditPage = (franchise) => {
    const role = localStorage.getItem("Role");

    // Check if the user is an Admin or Superadmin
    if (role === "Admin") {
      // Send only the FranchiseID to the edit page
      navigate("/admin/enquiry-edit", { state: { Id: franchise.EnquiryNo } });
    } else {
      // Optionally, show an alert if the user is not authorized
      alert("You are not authorized to edit this franchise.");
      // Redirect them to a different page or handle this appropriately
    }
  };


  // Function to handle navigating to the view page
  const toggleModalview = (franchise) => {
    const role = localStorage.getItem("Role");

    // Only Admin can view the franchise details
    if (role === "Admin") {
      navigate("/admin/enquiry-page", {
        state: { Id: franchise.EnquiryNo },
      });
    } else {
      // Optionally, show an alert or handle this case
      alert("You are not authorized to view this franchise.");
      // Redirect the user to another page if necessary
    }
  };

  const handleFollowUpClick = (franchise) => {
    setFollowUpData({
      ...followUpData,
      EnquiryNo: franchise.EnquiryNo,
      Name: franchise.Name,
      FranchiseName: franchise.FranchiseName,
      FranchiseId: franchise.FranchiseId,
      MobileNo: franchise.MobileNo,
      AMobileNo: franchise.AMobileNo,
      Course: franchise.Course,
      Message: "",
    });
    setShowModal(true);
  };

  // Function to handle the form submission
  const handleFollowUpSubmit = async () => {
    try {
      // Send follow-up data to your backend to save it in the FollowUp model
      await axios.post("https://franchiseapi.kictindia.com/followups/add", followUpData);
      alert("Follow-up saved successfully.");
      fetchFranchises(role)
      setShowModal(false);
    } catch (error) {
      console.error("Error saving follow-up:", error);
      alert("Failed to save follow-up.");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make the DELETE request to the API with the ID in the URL
      const response = await axios.delete(`https://franchiseapi.kictindia.com/followups/delete/${id}`);

      if (response.status === 200) {
        // If successful, filter the record out of the data state
        setFranchises((prevData) => prevData.filter((item) => item.EnquiryNo !== id));
        alert("Record deleted successfully.");
      } else {
        alert("Failed to delete the record.");
      }
    } catch (error) {
      console.error("There was an error deleting the record:", error);
      alert("An error occurred while deleting the record.");
    }
  };


  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFollowUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const totalPages = Math.ceil(franchises.length / itemsPerPage);
  const currentData = franchises.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(franchises);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Franchises");
    XLSX.writeFile(workbook, "franchises_data.xlsx");
  };

  const printTable = () => {
    const printContent = document.getElementById("franchise-table").outerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>All Franchise Data</title>
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


  const filteredData = franchises.filter((franchise) => {
    return (
      (franchise.FranchiseName?.toLowerCase().includes(
        searchFranchiseName.toLowerCase()
      ) ||
        !searchFranchiseName) &&
      (franchise.Name?.toLowerCase().includes(
        searchOwnerName.toLowerCase()
      ) ||
        !searchOwnerName) &&
      (franchise.Date?.toLowerCase().includes(searchDate.toLowerCase()) ||
        !searchDate) &&
      (franchise.MobileNo?.toLowerCase().includes(
        searchMobileNo.toLowerCase()
      ) ||
        !searchMobileNo) &&
      (franchise.FranchiseId?.toLowerCase().includes(searchFranchiseId.toLowerCase()) ||
        !searchFranchiseId) &&
      (franchise.City?.toLowerCase().includes(searchCity.toLowerCase()) ||
        !searchCity) &&
      (franchise.Course?.toLowerCase().includes(searchState.toLowerCase()) ||
        !searchState)
    );
  });

  const handleViewClick = (no) => {
    setPopupVisible(true);
    console.log(no)
    setEnquiryNo(no.EnquiryNo);

  };

  const closePopup = () => {
    setPopupVisible(false);
    setEnquiryNo(null);
  };

  const columns = [
    

    { name: "EnquiryNo", label: "Enquiry No" },
    { name: "Name", label: "Name" },
    { name: "FranchiseId", label: "Franchise Id" },
    { name: "FranchiseName", label: "Franchise Name" },
    { name: "MobileNo", label: "Mobile No" },
    { name: "AMobileNo", label: "Alternate Mobile No" },
    { name: "Course", label: "Course" },
    { name: "Date", label: "Date" },
    { name: "Time", label: "Time" },
    { name: "Message", label: "Message" },
    {
      name: "Followup",
      label: "Count",
      options: {
        customBodyRender: (value, tableMeta) => {
          const franchise = franchises[tableMeta.rowIndex];
          return (
            <p onClick={()=> handleViewClick(franchise)}>{value}</p>
          );
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const franchise = franchises[tableMeta.rowIndex];
          return (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <ActionButton color="blue" onClick={() => openFollowUpPage(franchise)}>
                Follow Up
              </ActionButton>
            </div>
          );
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const teacher = franchises[tableMeta.rowIndex];
          return (
            <div>
              <IconButton onClick={() => toggleModalview(teacher)} color="primary">
                <Eye />
              </IconButton>
              <IconButton onClick={() => openEditPage(teacher)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(teacher._id)} color="secondary">
                <Trash2 />
              </IconButton>

            </div>
          );
        },
      },
    },

  ];

  const openFollowUpPage = (franchise) => {
    setFollowUpData({
      EnquiryNo: franchise.EnquiryNo,
      Name: franchise.Name,
      FranchiseName: franchise.FranchiseName,
      FranchiseId: franchise.FranchiseId,
      MobileNo: franchise.MobileNo,
      AMobileNo: franchise.AMobileNo,
      Message: "",
      Course: franchise.Course,
    });
    setShowModal(true);
  };

  return (
    <MainDashboard>
      <TableContainer>
        <ButtonGroup>
          <Heading>Follow Ups</Heading>
        </ButtonGroup>


        <MUIDataTable
          id="teacher-table"
          data={franchises}
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
              // Filter out the "action" column
              const filteredColumns = columns.filter((col) => col.name !== "actions");
              const filteredData = data.map((row) => {
                const newRow = { ...row };
                delete newRow.action; // Ensure "action" data is excluded
                return newRow;
              });
            
              // Generate CSV content
              const csv = buildHead(filteredColumns) + buildBody(filteredData);
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
            
              // Set the file name with date
              const pageName = "FollowUp"; // Use the page name as a constant
              const today = new Date();
              const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
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

      </TableContainer>
      {showModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>Follow Up</ModalHeader>
            <Input
              type="text"
              value={followUpData.EnquiryNo}
              readOnly
            />
            <Input
              type="text"
              value={followUpData.Name}
              readOnly
            />
            <Input
              type="text"
              value={followUpData.Course}
              readOnly
            />
            <Textarea
              name="Message"
              value={followUpData.Message}
              onChange={handleInputChange}
              placeholder="Enter Follow-up Message"
            />
            <div style={{ display: "flex", width: "100%" }}>
              <ModalButton onClick={handleFollowUpSubmit}>
                Save Follow-up
              </ModalButton>
              <CloseButton onClick={() => setShowModal(false)}>
                Close
              </CloseButton>
            </div>
          </ModalContainer>
        </ModalOverlay>
      )}

      <PopupOverlay show={popupVisible}>
        <PopupContent>
          <PopupCloseButton onClick={closePopup}>X</PopupCloseButton>
          <PopupHeader>FollowUp Details</PopupHeader>
          <PopupBody>
            <FollowUpPagePop Id={enquiryNo} />
          </PopupBody>
        </PopupContent>
      </PopupOverlay>
    </MainDashboard>
  );
};

export default FollowUpPage;
