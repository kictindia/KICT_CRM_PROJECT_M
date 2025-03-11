import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify'; // Optional for success/error messages
import styled from 'styled-components'; // Import styled-components

// Container for the entire receipt page

const MainDashboard = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding: 20px;
  width:  -webkit-fill-available;
  background-color: #f9f9f9;
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


const ReceiptContainer = styled.div`
  padding: 30px;
  width: 85%;
  height: fit-content;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  border: 1px solid #ddd;
  margin: 1rem;
  @media (max-width: 480px){
    width: auto;
  }
`;

// Title at the top of the receipt
const ReceiptTitle = styled.h2`
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  text-transform: uppercase;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 2px solid #f4f4f4;
`;

// Section title
const SectionTitle = styled.h3`
  color: #333;
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  font-weight: bold;
  border-bottom: 2px solid #f4f4f4;
`;

// Individual information text
const InfoText = styled.p`
  font-size: 16px;
  margin: 8px 0;
  color: #333;
`;

// Table for Installment Details
const InstallmentTable = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  border: 1px solid #ddd;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  color: #333;
  font-size: 14px;
  text-align: left;
`;

// Button to download the receipt
const DownloadButton = styled.button`
  padding: 12px 20px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 20px auto 0;
  font-size: 16px;
  width: auto;
  text-transform: uppercase;

  &:hover {
    background-color: #45a049;
  }
`;

// Loading text style
const LoadingText = styled.p`
  text-align: center;
  font-size: 18px;
  color: #888;
`;

// Main FeeReceipt Component
const FeeReceipt = () => {
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use useLocation hook to access state passed through navigation
  const location = useLocation();
  const { studentId, courseId } = location.state || {};  // Extract studentId and courseId

  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/fee/get/${studentId}/${courseId}`);
        const data = await response.json();
        if (response.ok) {
          setFeeData(data);
        } else {
          toast.error('Failed to fetch fee details');
        }
      } catch (error) {
        toast.error('Error fetching fee data');
      } finally {
        setLoading(false);
      }
    };

    if (studentId && courseId) {
      fetchFeeData();
    }
  }, [studentId, courseId]);

  const generatePDF = () => {
    if (!feeData) {
      toast.error('No fee data available');
      return;
    }

    const { StudentName, CourseName, TotalFee, PaidFee, Balance, Installment } = feeData;
    const doc = new jsPDF('landscape');

    // Title and Student Information
    doc.setFontSize(18);
    doc.text('Fee Receipt', 210, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Student Name: ${StudentName}`, 10, 40);
    doc.text(`Course Name: ${CourseName}`, 10, 50);
    doc.text(`Total Fee: Rs.${TotalFee}`, 10, 60);
    doc.text(`Paid Fee: Rs.${PaidFee}`, 10, 70);
    doc.text(`Balance: Rs.${Balance}`, 10, 80);

    // Installment Details Table
    doc.setFontSize(12);
    doc.text('Installment Details', 210, 90, null, null, 'center');
    doc.autoTable({
      startY: 100,
      head: [['Date', 'Time', 'Payment Method', 'Amount']],
      body: Installment.map((installment) => [
        installment.Date,
        installment.Time,
        installment.PaymentMethod,
        `Rs.${installment.Amount}`,
      ]),
    });

    // Save the document
    doc.save(`${StudentName}_Fee_Receipt.pdf`);
  };

  return (
    <MainDashboard>

      <ReceiptContainer>
        <ReceiptTitle>Fee Receipt</ReceiptTitle>
        {loading ? (
          <LoadingText>Loading...</LoadingText>
        ) : feeData ? (
          <>
            {/* Display Fee Receipt Data */}
            <SectionTitle>Student Information</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns:"1fr 1fr", justifyItems:"center"}}>
              <InfoText><strong>Student Name:</strong> {feeData.StudentName}</InfoText>
              <InfoText><strong>Course Name:</strong> {feeData.CourseName}</InfoText>
              <InfoText><strong>Total Fee:</strong> ₹{feeData.TotalFee}</InfoText>
              <InfoText><strong>Paid Fee:</strong> ₹{feeData.PaidFee}</InfoText>
              <InfoText><strong>Balance:</strong> ₹{feeData.Balance}</InfoText>
            </div>

            <SectionTitle>Installment Details</SectionTitle>
            <InstallmentTable>
              <thead>
                <tr>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Time</TableHeader>
                  <TableHeader>Payment Method</TableHeader>
                  <TableHeader>Amount</TableHeader>
                </tr>
              </thead>
              <tbody>
                {feeData.Installment.map((installment, index) => (
                  <TableRow key={index}>
                    <TableCell>{installment.Date}</TableCell>
                    <TableCell>{installment.Time}</TableCell>
                    <TableCell>{installment.PaymentMethod}</TableCell>
                    <TableCell>₹{installment.Amount}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </InstallmentTable>

            {/* Show Download Button */}
            <DownloadButton onClick={generatePDF}>
              Download Fee Receipt
            </DownloadButton>
          </>
        ) : (
          <p>No fee data available</p>
        )}
      </ReceiptContainer>
    </MainDashboard>
  );
};

export default FeeReceipt;
