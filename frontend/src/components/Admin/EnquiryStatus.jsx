import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import FollowUpPage from "./FollowUpPageCard";
import { MainDashboard, Heading } from '../Styles/GlobalStyles';
import { IconButton } from "@mui/material";
import MUIDataTable from "mui-datatables";

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
  @media(max-width: 450px) {
    width: 60%;
  }
`;

const Franchisetable = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 1rem 0;
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
  text-align: center;
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

const ConfirmationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const ConfirmationBox = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
`;

const ConfirmationButton = styled.button`
  background-color: ${(props) => (props.confirm ? "#4CAF50" : "#f44336")};
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin: 10px;
  width: 40%;
`;

const AllEnquiry = () => {
  const navigate = useNavigate();
  const [franchises, setFranchises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [popupVisible, setPopupVisible] = useState(false);
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
  const [searchFranchiseName, setSearchFranchiseName] = useState("");
  const [searchOwnerName, setSearchOwnerName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchMobileNo, setSearchMobileNo] = useState("");
  const [searchFranchiseId, setSearchFranchiseId] = useState("");
  const [searchState, setSearchState] = useState("");
  const [enquiryNo, setEnquiryNo] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const temp = localStorage.getItem("Role");
    setRole(temp);
    fetchFranchises(temp);
  }, []);

  const fetchFranchises = async (role) => {
    try {
      const response = await fetch("http://localhost:8000/enquiry/all");
      const data = await response.json();

      if (role === "Admin") {
        setFranchises(data);
      } else if (role === "Franchise") {
        const franchiseId = localStorage.getItem("Id");
        const filteredData = data.filter((franchise) => franchise.FranchiseId === franchiseId);
        setFranchises(filteredData);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

  const addStudent = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/enquiry/add-student', data);
      alert("Student Added Successfully.");
      fetchFranchises(role);
    } catch (err) {
      alert("Something Went Wrong.\nPlease Try Again Later.");
    }
  };

  const handleFollowUpSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/followups/add", followUpData);
      alert("Follow-up saved successfully.");
      setShowModal(false);
      fetchFranchises();
    } catch (error) {
      console.error("Error saving follow-up:", error);
      alert("Failed to save follow-up.");
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(franchises);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Franchise Data");
    XLSX.writeFile(wb, "franchise_data.xlsx");
  };

  const openFollowUpPage = (franchise) => {
    setFollowUpData({
      EnquiryNo: franchise.EnquiryNo,
      Name: franchise.Name,
      FranchiseName: franchise.FranchiseName,
      FranchiseId: franchise.FranchiseId,
      MobileNo: franchise.MobileNo,
      AMobileNo: franchise.AMobileNo,
      Message: franchise.Message,
      Course: franchise.Course,
    });
    setShowModal(true);
  };

  const   handleDelete = (enquiryNo) => {
    setDeleteId(enquiryNo);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/enquiry/delete/${deleteId}`);
      if (response.status === 200) {
        setFranchises((prevFranchises) => prevFranchises.filter(franchise => franchise.EnquiryNo !== deleteId));
        alert('Follow-up deleted successfully.');
      } else {
        alert('Failed to delete follow-up.');
      }
    } catch (error) {
      console.error('Error deleting follow-up:', error);
      alert('Something went wrong. Please try again later.');
    }
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const columns = [
    {
      name: "EnquiryNo",
      label: "Enquiry No",
    },
    {
      name: "Name",
      label: "Name",
    },
    {
      name: "FranchiseName",
      label: "Franchise Name",
    },
    {
      name: "MobileNo",
      label: "Mobile No",
    },
    {
      name: "Course",
      label: "Course",
    },
    {
      name: "Followup",
      label: "Count",
      options: {
        customBodyRender: (value, tableMeta) => {
          const franchise = franchises[tableMeta.rowIndex];
          return <p onClick={() => handleViewClick(franchise)}>{value}</p>;
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
              <ActionButton
                color="orange"
                onClick={() => {
                  const role = localStorage.getItem("Role");  // Get the role from local storage
              
                  if (role === "Admin") {
                      // If role is admin, navigate to the admin's enquiry edit page
                      navigate("/admin/enquiry-edit", { state: { Id: franchise.EnquiryNo } });
                  } else if (role === "Franchise") {
                      // If role is franchise, navigate to the franchise's enquiry edit page (adjust path as needed)
                      navigate("/branch/enquiry-edit", { state: { Id: franchise.EnquiryNo } });
                  } else {
                      // Handle case for undefined or other roles (optional)
                      console.warn("Role not recognized or missing.");
                  }
              }}
              
              >
                Edit
              </ActionButton>
              <ActionButton
                color="green"
                onClick={() => addStudent(franchise)}
              >
                Join
              </ActionButton>
              <ActionButton
                color="red"
                onClick={() => handleDelete(franchise.EnquiryNo)}
              >
                Delete
              </ActionButton>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "select",
    responsive: "scrollMaxHeight",
    print: false,
    selectableRows: "none",
    onDownload: (buildHead, buildBody, columns, data) => {
      // Filter out the "actions" column
      const filteredColumns = columns.filter((col) => col.name !== "actions");
      const filteredData = data.map((row) => {
        const newRow = { ...row };
        delete newRow.actions; // Ensure "actions" data is excluded
        return newRow;
      });
    
      // Generate CSV content
      const csv = buildHead(filteredColumns) + buildBody(filteredData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
    
      // Set the file name with the proper date format
      const pageName = "AllEnquiry"; // Use the page name as a constant
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
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



  const handleViewClick = (no) => {
    setPopupVisible(true);
    setEnquiryNo(no.EnquiryNo);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setEnquiryNo(null);
  };

  return (
    <MainDashboard>
      <ButtonGroup>
        <Heading>All Enquiry</Heading>
      </ButtonGroup>

      <Franchisetable>
        <MUIDataTable
          data={franchises}
          columns={columns}
          options={options} />
      </Franchisetable>

      {/* Delete Confirmation Modal */}
      <ConfirmationOverlay show={showConfirmation}>
        <ConfirmationBox>
          <p>Are you sure you want to delete this follow-up?</p>
          <div>
            <ConfirmationButton confirm onClick={confirmDelete}>Yes</ConfirmationButton>
            <ConfirmationButton onClick={cancelDelete}>No</ConfirmationButton>
          </div>
        </ConfirmationBox>
      </ConfirmationOverlay>

      {/* Follow Up Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>Follow Up</ModalHeader>
            <Input type="text" value={followUpData.EnquiryNo} readOnly />
            <Input type="text" value={followUpData.Name} readOnly />
            <Input type="text" value={followUpData.Course} readOnly />
            <Textarea
              name="Message"
              value={followUpData.Message}
              onChange={(e) => setFollowUpData({ ...followUpData, Message: e.target.value })}
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

      {/* Popup Modal */}
      <PopupOverlay show={popupVisible}>
        <PopupContent>
          <PopupCloseButton onClick={closePopup}>X</PopupCloseButton>
          <PopupHeader>FollowUp Details</PopupHeader>
          <PopupBody>
            <FollowUpPage Id={enquiryNo} />
          </PopupBody>
        </PopupContent>
      </PopupOverlay>
    </MainDashboard>
  );
};

export default AllEnquiry;
