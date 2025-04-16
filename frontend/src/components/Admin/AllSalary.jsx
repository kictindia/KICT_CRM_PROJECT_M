import { useState, useEffect } from "react";
import styled from "styled-components";
import MUIDataTable from "mui-datatables";
import { Button, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { SiMicrosoftexcel } from "react-icons/si";
import { IoMdPrint } from "react-icons/io";
import * as XLSX from "xlsx";
import axios from "axios";
import { Heading, MainDashboard, Title } from "../Styles/GlobalStyles";
import { useNavigate } from "react-router-dom";

// Styled components
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
  gap: 1rem;
  
  /* For mobile screens, set flex-direction to column */
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;


const ButtonStyled = styled(Button)`
  background-color: #3330e4;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
`;

const getLastMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0 = January, 11 = December

    if (currentMonth === 0) {
        currentDate.setMonth(11); // December
        currentDate.setFullYear(currentDate.getFullYear() - 1); // Previous year
    } else {
        currentDate.setMonth(currentMonth - 1); // Otherwise, just go back 1 month
    }

    return currentDate.toLocaleString("default", { month: "long" });
};

const getCurrentYear = () => {
    if (getLastMonth() == "December") {
        return (new Date()).getFullYear() - 1
    } else {
        return new Date().getFullYear();
    }
};

const AllSalary = () => {
    const navigate = useNavigate();
    const [salaries, setSalaries] = useState([]);
    const [salary, setSalary] = useState("");
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedYear, setSelectedYear] = useState();
    const [openModal, setOpenModal] = useState(false); // Modal visibility state
    const [selectedSalaryDetails, setSelectedSalaryDetails] = useState(null); // State to hold salary details for the modal

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const role = localStorage.getItem("Role");
                setLoading(true);
                const response = await fetch("http://localhost:8000/salary/all");
                const data = await response.json();
                let newData = data.salaries;

                if (role === "Franchise") {
                    const id = localStorage.getItem("Id");
                    newData = newData.filter((val) => val.FranchiseId === id);
                } else if (role === "Teacher") {
                    const id = JSON.parse(localStorage.getItem("TeacherData"));
                    newData = newData.filter((val) => val.FranchiseId === id.FranchiseId);
                }

                setSalaries(newData.reverse());
                setFilteredSalaries(
                    newData.filter((salary) => salary.Month === getLastMonth() || salary.Year === getCurrentYear())
                );
            } catch (error) {
                console.error("Error fetching salary data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalaries();
    }, []);

    useEffect(() => {
        let filtered = salaries;

        if (selectedMonth) {
            filtered = filtered.filter((salary) => salary.Month === selectedMonth);
        }

        if (selectedYear) {
            filtered = filtered.filter((salary) => salary.Year === selectedYear);
        }

        setFilteredSalaries(filtered);
    }, [selectedMonth, selectedYear, salaries]);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(salaries);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Salaries");
        XLSX.writeFile(workbook, "salaries_data.xlsx");
    };

    const printTable = () => {
        const printContent = document.getElementById("salary-table").outerHTML;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
      <html>
        <head>
          <title>All Salary Data</title>
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

    const columns = [
        {
            name: "Name",
            label: "Teacher Name",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "Month",
            label: "Month",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "Year",
            label: "Year",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "BaseSalary",
            label: "Base Salary",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "PresentCount",
            label: "Present Days",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "Salary",
            label: "Total Salary",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "PaidAmount",
            label: "Paid Salary",
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: "Status",
            label: "Status",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "Action",
            label: "Action",
            options: {
                filter: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const salary = filteredSalaries[tableMeta.rowIndex];
                    return (
                        <div>
                            {salary.Status === "Unpaid" ? (
                                <ButtonStyled onClick={() => handleViewClick(salary)}>Pay</ButtonStyled>
                            ) : (
                                <ButtonStyled onClick={() => handleViewClick(salary)}>View</ButtonStyled>
                            )}
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
        elevation: 1,
        selectableRows: "none",
        pagination: true,
        rowsPerPageOptions: [5, 10, 15],
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
            const pageName = "All Salary"; // Use the page name as a constant
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

    const handlePayClick = async (salary) => {
        try {
            const updatedSalary = { ...salary, Status: "Paid" };
            const response = await axios.put(
                `http://localhost:8000/salary/update/${salary._id}`,
                updatedSalary
            );

            if (response.status === 200) {
                setSalaries((prevSalaries) =>
                    prevSalaries.map((s) =>
                        s._id === salary._id ? { ...s, Status: "Paid" } : s
                    )
                );
                alert(`Salary for ${salary.Name} has been marked as Paid`);
            }
        } catch (error) {
            console.error("Error updating salary status:", error);
            alert("Failed to update salary status");
        }
    };


    const PayPopUp = (data) => {
        setOpenModal(true);
        setSelectedSalaryDetails(data);
    }

    const handleViewClick = (salary) => {
        const role = localStorage.getItem("Role");  // Get the role from local storage
        
        setSelectedSalaryDetails(salary);
        
        if (role === "Admin") {
            // Navigate to the admin view
            navigate("/admin/View-Teacher-Salary", { state: salary });
        } else if (role === "Franchise") {
            // Navigate to a different view for franchise
            navigate("/branch/View-Teacher-Salary", { state: salary }); // Replace this with the desired path for franchise
        } else {
            // Handle case for undefined or other roles (optional)
            console.warn("Role not recognized or missing.");
        }
    };
    

    const handleCloseModal = () => {
        setOpenModal(false); // Close the modal
        setSelectedSalaryDetails(null); // Reset the selected salary details
    };

    return (
        <MainDashboard>
            <TableContainer>
                <ButtonGroup>
                    <Heading>All Salary Details</Heading>
                </ButtonGroup>

                <ButtonGroup>
                    <div>
                        <FormControl variant="outlined" size="small">
                            <InputLabel>Month</InputLabel>
                            <Select
                                style={{ width: "150px" }}
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                label="Month"
                            >
                                <MenuItem value="">Select Month</MenuItem>
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                                    <MenuItem key={month} value={month}>
                                        {month}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl variant="outlined" size="small">
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                label="Year"
                                style={{ width: "150px" }}
                            >
                                <MenuItem value="">Select Month</MenuItem>
                                {Array.from(new Set(salaries.map((salary) => salary.Year))).map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </ButtonGroup>

                <MUIDataTable
                    data={filteredSalaries}
                    columns={columns}
                    options={options}
                />
            </TableContainer>

            {/* Modal to display selected salary details */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Pay Salary To {selectedSalaryDetails?.Name}</DialogTitle>
                <DialogContent>
                    {selectedSalaryDetails && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <Title><strong>Month:</strong> {selectedSalaryDetails.Month}</Title>
                            <Title><strong>Year:</strong> {selectedSalaryDetails.Year}</Title>
                            <Title><strong>Base Salary:</strong> {selectedSalaryDetails.BaseSalary}</Title>
                            <Title><strong>Salary Per Day:</strong> {Math.round(selectedSalaryDetails.BaseSalary / 26)}</Title>
                            <Title><strong>Present Days:</strong> {selectedSalaryDetails.PresentCount}</Title>
                            <Title><strong>Total Salary:</strong> {selectedSalaryDetails.Salary}</Title>
                            <Title><strong>Status:</strong> {selectedSalaryDetails.Status}</Title>
                        </div>
                    )}
                    <input type="text" placeholder="Enter Salary ₹" value={salary} onChange={(e) => setSalary(e.target.value)} />
                </DialogContent>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "24px", paddingTop: "0" }}>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                </div>
            </Dialog>
        </MainDashboard>
    );
};

export default AllSalary;
