import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate to programmatically navigate
import styled from "styled-components"; // For styling
import MUIDataTable from "mui-datatables"; // Import MUI DataTable
import { Heading, MainDashboard } from "../Styles/GlobalStyles";

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
  @media (max-width: 450px) {
    width: 60%;
  }
`;

const AllFee = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetching fee data from the API
  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const role = localStorage.getItem("Role");

        const response = await fetch("https://franchiseapi.kictindia.com/fee/all");
        const data = await response.json();

        if (response.ok) {
          if (role === "Franchise") {
            const id = localStorage.getItem("Id");
            const filterData = data.filter((val) => val.FranchiseId === id);
            setFees(filterData);
          } else if (role === "Teacher") {
            const id = JSON.parse(localStorage.getItem("TeacherData"));
            const filterData = data.filter(
              (val) => val.FranchiseId === id.FranchiseId
            );
            setFees(filterData);
          } else {
            setFees(data);
          }
        } else {
          console.error("Failed to fetch fee data");
        }
      } catch (error) {
        console.error("Error fetching fee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, []);

  const handleViewReceipt = (studentId, courseId) => {
    const role = localStorage.getItem("Role"); // Get the role from local storage

    if (role === "Admin") {
      // Navigate to admin view with studentId and courseId
      navigate("/admin/feereceipt", { state: { studentId, courseId } });
    } else if (role === "Franchise") {
      // Navigate to a different path for franchise (adjust as needed)
      navigate("/branch/feereceipt", { state: { studentId, courseId } });
    } else {
      // Handle case for undefined or other roles (optional)
      console.warn("Role not recognized or missing.");
    }
  };

  const columns = [
    { name: "StudentId", label: "Student ID" },
    { name: "StudentName", label: "Student Name" },
    { name: "CourseName", label: "Course" },
    { name: "TotalFee", label: "Total Fee" },
    { name: "PaidFee", label: "Paid Fee" },
    { name: "Balance", label: "Balance" },
    {
      name: "Action",
      label: "Action",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const { rowIndex } = tableMeta;
          const fee = fees[rowIndex]; // Get the corresponding fee data for this row
          return (
            <button
              onClick={() => handleViewReceipt(fee.StudentId, fee.CourseId)}
              style={{
                backgroundColor: "#3330e4",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
              }}
            >
              View Fee Receipt
            </button>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "select",
    responsive: "scrollMaxHeight",
    print: false,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    selectableRows: "none", // Disable row selection
    customToolbarSelect: () => null, // Disable row selection dropdown
    textLabels: {
      body: {
        noMatch: "Sorry, no matching records found",
      },
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      // Filter out the "actions" column
      const filteredColumns = columns.filter((col) => col.name !== "Action");
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
      const pageName = "All Fee"; // Use the page name as a constant
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
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
          <Heading>All Fees</Heading>
        </ButtonGroup>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <MUIDataTable
            data={fees.map((fee) => [
              fee.StudentId,
              fee.StudentName,
              fee.CourseName,
              `₹${fee.TotalFee}`,
              `₹${fee.PaidFee}`,
              `₹${fee.Balance}`,
              "View Fee Receipt",
            ])}
            columns={columns}
            options={options}
          />
        )}
      </TableContainer>
    </MainDashboard>
  );
};

export default AllFee;
