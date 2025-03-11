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

const FeeDetailsTable = () => {
  const [feeData, setFeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate(); // To navigate to the Payment page

  // Fetch the data from API when the component mounts
  useEffect(() => {
    var role = localStorage.getItem("Role");
    const fetchData = async () => {
      try {
        const response = await fetch('https://franchiseapi.kictindia.com/fee/all'); // Replace with your actual API URL
        const data = await response.json();
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
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    // Filter data by Student Name, Course Name, or Student ID
    const filtered = feeData.filter((fee) =>
      fee.StudentName.toLowerCase().includes(value.toLowerCase()) ||
      fee.CourseName.toLowerCase().includes(value.toLowerCase()) ||
      fee.StudentId.toLowerCase().includes(value.toLowerCase()) ||
      fee.FranchiseId.toLowerCase().includes(value.toLowerCase()) ||
      fee.FranchiseName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  const handlePayButtonClick = (fee) => {
    // Get the user role from localStorage
    const userRole = localStorage.getItem('Role'); // assuming the role is stored as 'role' in localStorage

    // Check the role and navigate accordingly
    if (userRole === 'Admin') {
      navigate(`/admin/payment/${fee.StudentId}/${fee.CourseId}`);
    } else if (userRole === 'Franchise') {
      navigate(`/branch/payment/${fee.StudentId}/${fee.CourseId}`);
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
    { name: 'StudentId', label: 'Student ID' },
    { name: 'CourseId', label: 'Course ID' },
    { name: 'StudentName', label: 'Student Name' },
    { name: 'CourseName', label: 'Course Name' },
    { name: 'TotalFee', label: 'Total Fee' },
    { name: 'PaidFee', label: 'Paid Fee' },
    { name: 'Balance', label: 'Balance' },
    { name: 'FranchiseId', label: 'Franchise ID' },
    { name: 'FranchiseName', label: 'Franchise Name' },
    { name: 'FeeSlot', label: 'Fee Slot' },
    {
      name: 'Installments', label: 'Installments',
      options: {
        customBodyRender: (value) => {
          return value.length > 0 ? (
            value.map((inst, index) => (
              <div key={index}>
                {inst.Date} - {inst.Amount}
              </div>
            ))
          ) : (
            'No installments yet'
          );
        }
      }
    },
    {
      name: 'Action',
      label: 'Action',
      options: {
        customBodyRender: (value, tableMeta) => {
          const { rowIndex } = tableMeta;
          const fee = filteredData[rowIndex]; // Get corresponding fee data
          return (
            <PayButton onClick={() => handlePayButtonClick(fee)}>
              Pay
            </PayButton>
          );
        }
      }
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
    }
  };

  return (
    <MainDashboard>
      <TableContainer>
        <ButtonGroup>
          <Heading>All Fees</Heading>
        </ButtonGroup>
        <MUIDataTable
          data={filteredData.map(fee => [
            fee.StudentId,
            fee.CourseId,
            fee.StudentName,
            fee.CourseName,
            `₹${fee.TotalFee}`,
            `₹${fee.PaidFee}`,
            `₹${fee.Balance}`,
            fee.FranchiseId,
            fee.FranchiseName,
            fee.FeeSlot.join(', '),
            fee.Installment,
            'Pay'
          ])}
          columns={columns}
          options={options}
        />
      </TableContainer>
    </MainDashboard>
  );
};

export default FeeDetailsTable;
