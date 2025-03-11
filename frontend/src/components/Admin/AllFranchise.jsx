import React, { useEffect, useState } from "react";
import { 
  Container, 
  Typography, 
  CircularProgress, 
  IconButton, 
  Menu, 
  MenuItem, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from "@mui/material";
import axios from "axios";
import { Edit, Delete, Visibility, MoreVert } from "@mui/icons-material"; // Material icons for actions
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import MUIDataTable from "mui-datatables";
import { MainDashboard } from "../Styles/GlobalStyles";

const FranchiseTable = () => {
  const navigate = useNavigate();
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null); // For managing the dropdown menu
  const [selectedFranchise, setSelectedFranchise] = useState(null); // To hold selected franchise data
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // For delete confirmation modal

  // Fetch data from the backend
  useEffect(() => {
    axios
      .get("https://franchiseapi.kictindia.com/franchise/all")
      .then((response) => {
        setFranchises(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Handle opening the dropdown menu
  const handleMenuClick = (event, franchise) => {
    setAnchorEl(event.currentTarget);
    setSelectedFranchise(franchise); // Set the selected franchise
  };

  // Handle closing the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFranchise(null);
  };

  // View Franchise
  const handleView = () => {
    navigate("/admin/viewfranchise", { state: { Id: selectedFranchise.FranchiseID } });
    setAnchorEl(null);
  };

  // Edit Franchise
  const handleEdit = () => {
    navigate("/admin/editfranchise", { state: { FranchiseID: selectedFranchise.FranchiseID } });
    setAnchorEl(null);
  };

  // Open delete confirmation dialog
  const handleDelete = () => {
    setOpenDeleteDialog(true);
    setAnchorEl(null);
  };

  // Confirm deletion
  const confirmDelete = () => {
    axios
      .delete(`https://franchiseapi.kictindia.com/franchise/delete/${selectedFranchise.FranchiseID}`)
      .then(() => {
        setFranchises(franchises.filter((f) => f.FranchiseID !== selectedFranchise.FranchiseID));
        setOpenDeleteDialog(false);
      })
      .catch((error) => {
        console.error("Error deleting franchise:", error);
      });
  };

  // Close delete confirmation dialog
  const handleDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  // Export data to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(franchises); // Convert JSON to Excel sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Franchises"); // Append the sheet to a new workbook
    XLSX.writeFile(wb, "franchises_data.xlsx"); // Write the Excel file
  };

  // Define columns for MUIDataTable
  const columns = [
    {
      name: "actions", // Column for Action Buttons
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const franchise = franchises[tableMeta.rowIndex];
          return (
            <div>
              <IconButton
                onClick={(event) => handleMenuClick(event, franchise)}
                color="primary"
              >
                <MoreVert />
              </IconButton>
            </div>
          );
        },
      },
    },
    { name: "FranchiseID", label: "Franchise ID" },
    { name: "FranchiseName", label: "Franchise Name" },
    { name: "OwnerName", label: "Owner Name" },
    { name: "UPIId", label: "UPI ID" },
    { name: "UPICode", label: "UPI Code" },
    { name: "Email", label: "Email" },
    { name: "MobileNo", label: "Mobile No" },
    { name: "Address", label: "Address" },
    { name: "State", label: "State" },
    { name: "City", label: "City" },
    { name: "Area", label: "Area" },
    { name: "Pincode", label: "Pincode" },
    { name: "Date", label: "Date" },
    { name: "HeadOffice", label: "Head Office", options: { customBodyRender: (value) => (value ? "Yes" : "No") } },
    { name: "OpenTime", label: "Open Time" },
    { name: "CloseTime", label: "Close Time" },
  ];

  return (
    <MainDashboard>
      <Container maxWidth={false} style={{ width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Franchise List
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <MUIDataTable
            data={franchises}
            columns={columns}
            options={{
              filterType: "select",
              responsive: "scrollMaxHeight",
              print: false,
              selectableRows: "none",
              search: true,
              rowsPerPage: 10,
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
                const pageName = "AllFranchise"; // Use the page name as a constant
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
        )}

        {/* Action Menu for each row */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleView}>View</MenuItem>
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDialogClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this franchise? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainDashboard>
  );
};

export default FranchiseTable;
