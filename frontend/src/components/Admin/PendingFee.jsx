import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for programmatic navigation
import MUIDataTable from 'mui-datatables'; // Import MUI DataTable
import { Heading, MainDashboard } from '../Styles/GlobalStyles';

const TableContainer = styled.div`
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow-x: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.color};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
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

const FilterInput = styled.input`
  padding: 8px;
  margin: 10px 0;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const PayButton = styled.button`
  background-color: #3330e4;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #3330e4;
  }
`;

const PendingFee = () => {
    const [feeData, setFeeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const navigate = useNavigate(); // To navigate to the Payment page


    function parseDate(dateStr) {
        if (dateStr) {
            const [month, day, year] = dateStr?.split('/');
            console.log(new Date(year, month - 1, day))
            return new Date(year, month - 1, day);  // JavaScript months are 0-based
        }
    }

    // Fetch the data from API when the component mounts
    useEffect(() => {
        var role = localStorage.getItem("Role");
        const fetchData = async () => {
            try {
                const response = await fetch('https://franchiseapi.kictindia.com/fee/all'); // Replace with your actual API URL
                const result = await response.json();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                console.log(today);


                const data = result.flatMap(student =>
                    student.FeeSlot
                        .filter(feeSlot => parseDate(feeSlot.Date) <= today) // Filter for past and today's dates
                        .map((feeSlot, index) => ({
                            StudentId: student.StudentId,
                            StudentName: student.StudentName,
                            CourseName: student.CourseName,
                            CourseId: student.CourseId,
                            TotalFee: student.TotalFee,
                            FranchiseName: student.FranchiseName,
                            FranchiseId: student.FranchiseId,
                            Amount: feeSlot.Amount,
                            Date: feeSlot.Date,
                            Status: feeSlot.Status,
                            PaidAmount: feeSlot.PaidAmount,
                            Installment: index + 1
                        })).filter(val => val.Status != "Paid")
                );
                // console.log(data)
                if (role == "Franchise") {
                    const id = localStorage.getItem("Id");
                    const filterData = data.filter(val => val.FranchiseId == id);
                    setFeeData(filterData);
                    setFilteredData(filterData);
                } else if (role == "Teacher") {
                    const id = JSON.parse(localStorage.getItem("TeacherData"));
                    const filterData = data.filter(val => val.FranchiseId == id.FranchiseId);
                    setFeeData(filterData);
                    setFilteredData(filterData);
                } else {
                    setFeeData(data);
                    setFilteredData(data);
                }
                // console.log(result);
                // console.log(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                console.log(err)
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePayButtonClick = (fee) => {
        // Get the user role from localStorage
        const userRole = localStorage.getItem('Role'); // assuming the role is stored as 'role' in localStorage

        // Check the role and navigate accordingly
        if (userRole === 'Admin') {
            navigate(`/admin/payment/${fee.StudentId}/${fee.CourseId}`, { state: fee });
        } else if (userRole === 'Franchise') {
            navigate(`/branch/payment/${fee.StudentId}/${fee.CourseId}`, { state: fee });
        } else {
            console.log("Unknown role, unable to navigate");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const columns = [
        {
            name: 'StudentId',
            label: 'Student ID',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: 'CourseId',
            label: 'Course ID',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: 'StudentName',
            label: 'Student Name',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: 'CourseName',
            label: 'Course Name',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: 'TotalFee',
            label: 'Total Fee',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: 'Amount',
            label: 'Pending Fee',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: 'Date',
            label: 'Due Date',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: 'FranchiseId',
            label: 'Franchise ID',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: 'FranchiseName',
            label: 'Franchise Name',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: 'Installment',
            label: 'Installment',
            options: {
                setCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } }),
                setHeaderCellProps: () => ({ style: { textAlign: 'center', whiteSpace: 'nowrap' } })
            }
        },
        {
            name: "Actions",
            label: "Actions",
            options: {
                customBodyRender: (value, tableMeta) => {
                    const fee = feeData[tableMeta.rowIndex];
                    return (
                        <ActionButton
                            color="green"
                            onClick={() => handlePayButtonClick(fee)}
                        >
                            Pay Fee
                        </ActionButton>
                    );
                },
            },
        }
    ];



    const options = {
        filterType: 'select',
        responsive: "scrollMaxHeight",
        print: false,
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 15],
        selectableRows: 'none', // Disable row selection
        textLabels: {
            body: {
                noMatch: "Sorry, no matching records found",
            },
        },
        onDownload: (buildHead, buildBody, columns, data) => {
            // Filter out the "actions" column
            const filteredColumns = columns.filter((col) => col.name !== "Actions");
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
            const pageName = "Pendong Fee"; // Use the page name as a constant
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

    return (
        <MainDashboard>
            <TableContainer>
                <ButtonGroup>
                    <Heading>Pending Fees</Heading>
                </ButtonGroup>
                <MUIDataTable
                    data={filteredData}
                    columns={columns}
                    options={options}
                />
            </TableContainer>
        </MainDashboard>
    );
};

export default PendingFee;
