import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Edit, Trash2, View } from "lucide-react";
import { Heading, MainDashboard } from "../Styles/GlobalStyles";
import MUIDataTable from "mui-datatables";
import { IconButton } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TableContainer = styled.div`
  font-family: Arial, sans-serif;
  margin: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow-x: auto;
  max-width: 100%;
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

const CertificatesList = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch certificates data when component mounts
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get("https://franchiseapi.kictindia.com/certificates/all");
        setCertificates(response.data);
      } catch (err) {
        setError("Error fetching certificates");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Delete certificate
  const handleDelete = async (id) => {
    setCertificateToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://franchiseapi.kictindia.com/certificates/delete/${certificateToDelete}`);
      setCertificates(certificates.filter((cert) => cert.CertificateId !== certificateToDelete));
      setShowModal(false);
      toast.success("Certificate deleted successfully!");
    } catch (err) {
      toast.error("Error deleting certificate");
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  // Edit certificate (redirect to Edit page with certificate data)
  const handleEdit = (certificate) => {
    navigate("/admin/edit-certificate", { state: { certificate } });
  };

  // View certificate (redirect to certificate view page)
  const handleViewCertificate = (CertificateId) => {
    navigate(`/admin/view-certificate/${CertificateId}`);
  };

  // View marksheet (redirect to marksheet view page)
  const handleViewMarksheet = (CertificateId) => {
    navigate(`/admin/view-marksheet/${CertificateId}`);
  };

  // Columns for the MUIDataTable
  const columns = [
    {
      name: "CertificateId",
      label: "Certificate ID",
    },
    {
      name: "StudentId",
      label: "Student ID",
    },
    {
      name: "CourseId",
      label: "Course ID",
    },
    {
      name: "FranchiseId",
      label: "Franchise ID",
    },
    {
      name: "Percentage",
      label: "Percentage",
    },
    {
      name: "Grade",
      label: "Grade",
    },
    {
      name: "Date",
      label: "Date",
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const certificate = certificates[tableMeta.rowIndex];
          return (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {/* View MarkSheet Button */}
              <IconButton
                onClick={() => handleViewMarksheet(certificate.CertificateId)}
                color="primary"
                style={{ padding: 5, fontSize: "14px" }}
              >
                <View style={{ fontSize: 18 }} /> {/* Smaller Icon */}
                Marksheet
              </IconButton>
              {/* View Certificate Button */}
              <IconButton
                onClick={() => handleViewCertificate(certificate.CertificateId)}
                color="primary"
                style={{ padding: 5, fontSize: "14px" }}
              >
                <View style={{ fontSize: 18 }} /> {/* Smaller Icon */}
                Certificate
              </IconButton>
              {/* Edit Button */}
              <IconButton onClick={() => handleEdit(certificate)} color="primary">
                <Edit />
              </IconButton>
              {/* Delete Button */}
              <IconButton onClick={() => handleDelete(certificate.CertificateId)} color="secondary">
                <Trash2 />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    responsive: "scrollMaxHeight",
    print: false,
    filterType: "select",
    selectableRows: "none",
    search: true,
    rowsPerPage: 8,
    onRowClick: (rowData) => console.log(rowData),
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
      const pageName = "CertificatesList"; // Use the page name as a constant
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
  };

  return (
    <MainDashboard>
      <TableContainer>
        <ButtonGroup>
          <Heading>All Certificates</Heading>
        </ButtonGroup>

        {loading ? (
          <div>Loading certificates...</div>
        ) : error ? (
          <div>{error}</div>
        ) : certificates.length === 0 ? (
          <div>No certificates found</div>
        ) : (
          <MUIDataTable
            data={certificates}
            columns={columns}
            options={options}
          />
        )}
      </TableContainer>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Are you sure you want to delete this certificate?</h3>
            <YesButton onClick={confirmDelete}>Yes</YesButton>
            <NoButton onClick={cancelDelete}>No</NoButton>
          </ModalContent>
        </ModalOverlay>
      )}

      <ToastContainer />
    </MainDashboard>
  );
};

export default CertificatesList;
