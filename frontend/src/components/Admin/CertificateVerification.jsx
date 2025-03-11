import { useState, useEffect } from "react";
import styled from "styled-components";
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
  @media(max-width: 450px){
    width: 60%;
  }
`;

const OpenButton = styled(Button)`
  background-color: #3330e4;
`;

const CertificateTable = styled.div`
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

const CertificateVerification = () => {
    const [certificates, setCertificates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemPerPage] = useState(8);
    const [showModal, setShowModal] = useState(false);
    const [certificateToDelete, setCertificateToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const role = localStorage.getItem("Role");
    const userId = localStorage.getItem("Id");

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await fetch("https://franchiseapi.kictindia.com/certificates/all");
                const data = await response.json();

                if (role === "Franchise" && userId) {
                    const filteredCertificates = data.reverse().filter(cert => cert.FranchiseId === userId);
                    setCertificates(filteredCertificates);
                } else {
                    setCertificates(data.reverse());
                }
            } catch (error) {
                console.error("Error fetching certificates:", error);
                toast.error("Failed to load certificates.");
            }
        };

        fetchCertificates();
    }, [role, userId]);

    const handleToggleVerification = async (certificateId, currentStatus) => {
        try {
            const response = await fetch(`https://franchiseapi.kictindia.com/certificates/${certificateId}/admin-verified`, {
                method: "PATCH",
                body: JSON.stringify({
                    AdminVerified: !currentStatus,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const updatedCert = await response.json();
                setCertificates(certificates.map(cert =>
                    cert.CertificateId === certificateId ? { ...cert, AdminVerified: updatedCert.AdminVerified } : cert
                ));
                toast.success("Verification status updated successfully!");
            } else {
                toast.error("Failed to update verification status.");
            }
        } catch (error) {
            toast.error("Error updating verification status.");
        }
    };

    const handleDelete = (id) => {
        setCertificateToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`https://franchiseapi.kictindia.com/certificates/delete/${certificateToDelete}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setCertificates(certificates.filter(cert => cert.CertificateId !== certificateToDelete));
                setShowModal(false);
                toast.success("Certificate deleted successfully!");
            } else {
                toast.error("Failed to delete certificate.");
            }
        } catch (error) {
            toast.error("Error deleting certificate.");
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(certificates);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Certificates");
        XLSX.writeFile(workbook, "certificates_data.xlsx");
        toast.success("Data exported to Excel!");
    };

    const printTable = () => {
        const printContent = document.getElementById("certificate-table").outerHTML;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
      <html>
        <head>
          <title>All Certificates</title>
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

    const filteredCertificates = certificates.filter(
        (certificate) =>
            certificate.CertificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            certificate.StudentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            name: "actions",
            label: "Actions",
            options: {
                customBodyRender: (value, tableMeta) => {
                    const certificate = filteredCertificates[tableMeta.rowIndex];
                    return (
                        <div>
                            <IconButton
                                onClick={() => handleToggleVerification(certificate.CertificateId, certificate.AdminVerified)}
                                color={certificate.AdminVerified ? "success" : "warning"}
                                style={{ fontSize: "14px" }}
                            >
                                {certificate.AdminVerified ? "Revoke Verification" : "Verify"}
                            </IconButton>
                            <IconButton onClick={() => handleDelete(certificate.CertificateId)} color="secondary">
                                <Trash2 fontSize={14} />
                            </IconButton>
                        </div>
                    );
                },
            },
        },
        { name: "CertificateId", label: "Certificate ID" },
        { name: "StudentId", label: "Student ID" },
        { name: "CourseId", label: "Course ID" },
        { name: "FranchiseId", label: "Franchise ID" },
        {
            name: "AdminVerified",
            label: "Admin Verified",
            options: {
                customBodyRender: (value) => {
                    return value ? "Verified" : "Not Verified"; // Display 'Verified' or 'Not Verified' based on the boolean value
                },
            },
        },
    ];

    return (
        <MainDashboard>
            <TableContainer>
                <ButtonGroup>
                    <Heading>Certificate Verification</Heading>
                </ButtonGroup>

                <MUIDataTable
                    id="certificate-table"
                    data={filteredCertificates}
                    columns={columns}
                    options={{
                        responsive: "scrollMaxHeight",
                        print: false,
                        filterType: "select",
                        selectableRows: "none",
                        search: true,
                        rowsPerPage: itemsPerPage,
                        page: currentPage - 1,
                        onChangePage: (page) => setCurrentPage(page + 1),
                        onChangeRowsPerPage: (numberOfRows) => setItemPerPage(numberOfRows),
                        onDownload: (buildHead, buildBody, columns, data) => {
                            // Filter out the "actions" column
                            const filteredColumns = columns.filter((col) => col.name !== "Actions");

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
                            const pageName = "ApprovedCertificates"; // Use the page name as a constant
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

export default CertificateVerification;
