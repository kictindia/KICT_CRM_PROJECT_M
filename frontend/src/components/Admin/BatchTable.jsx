import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import MUIDataTable from "mui-datatables";
import { Heading, MainDashboard, SubmitButton } from '../Styles/GlobalStyles';
import { Button } from '@mui/material';

// Styled components
const ButtonGroup = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  padding: 1rem ;
`;

const ButtonStyled = styled(Button)`
  padding: 10px 20px;
  background-color: #3330e4;
  color: white;
  font-weight: bold;
  width: 30%;
  font-size: 18px;
  @media(max-width: 450px){
    width: 60%;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  font-size: 14px;
  text-align: center;
`;

const ModalHeader = styled.h1`
  margin-top: 0;
`;

const ModalButton = styled(Button)`
  padding: 10px;
  background-color: #f44336;
  color: white;
  border-radius: 4px;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #d32f2f;
  }
`;

const StudentList = styled.ul`
  list-style-type: none;
  padding: 0;
  text-align: center;
`;

const StudentListItem = styled.li`
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
`;

const Wrapper = styled.div`
  width: 80%;
  margin: 20px auto;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 75.5vh;
  overflow-y: auto;
`;

// React component
const BatchTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:8000/batch/all')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching the data: ", error);
        setLoading(false);
      });
  }, []);

  const handleViewClick = (students) => {
    setSelectedSlot(students);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Map the data to fit MUI DataTable structure
  const tableData = [];
  data.forEach(batch => {
    batch.Batch.forEach(batchItem => {
      batchItem.Slots.forEach(slot => {
        const studentsPresent = slot.Students;
        tableData.push([
          batch.FranchiseId,
          batch.FranchiseName,
          batchItem.Hour,
          slot.SlotTime,
          studentsPresent.length,
          <ButtonStyled onClick={() => handleViewClick(studentsPresent)}>View</ButtonStyled>
        ]);
      });
    });
  });

  const columns = [
    { name: "Franchise ID", label: "Franchise ID", options: { textAlign: "center" } },
    { name: "Franchise Name", label: "Franchise Name", options: { textAlign: "center" } },
    { name: "Batch Hour", label: "Batch Hour", options: { textAlign: "center" } },
    { name: "Slot Time", label: "Slot Time", options: { textAlign: "center" } },
    { name: "Student Count", label: "Student Count", options: { textAlign: "center" } },
    { name: "Action", label: "Action", options: { filter: false, sort: false, textAlign: "center" } }
  ];

  const options = {
    filterType: "select",
    responsive: "scrollMaxHeight",
              print: false,
    elevation: 1,
    selectableRows: "none",
    pagination: true,
    rowsPerPageOptions: [5, 10, 15],
    textLabels: {
      body: {
        noMatch: "No records found",
        toolTip: "Sort",
        columnHeaderTooltip: column => `Sort for ${column.label}`,
      },
    },
    textAlign: 'center',
    customTableBodyCellProps: {
      style: {
        textAlign: 'center',
        padding: '10px', 
      }
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
      const pageName = "All Batches"; // Use the page name as a constant
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
      <ButtonGroup>
        <Heading>Batch Table</Heading>
      </ButtonGroup>

        <MUIDataTable
          data={tableData}
          columns={columns}
          options={options}
        />


      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Student Details:</ModalHeader>
            <StudentList>
              {selectedSlot.map(student => (
                <StudentListItem key={student._id}>
                  {student.StudentName}
                </StudentListItem>
              ))}
            </StudentList>
            <SubmitButton onClick={handleCloseModal}>Close</SubmitButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </MainDashboard>
  );
};

export default BatchTable;
