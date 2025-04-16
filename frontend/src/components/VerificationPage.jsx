import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { InputContainer, Main, Main1, MainDashboard } from './Styles/GlobalStyles';

// Styled Components
const VerificationContainer = styled(MainDashboard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  margin: auto;
  width: 80%;
  height: 100%;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CertificateDetails = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const DetailItem = styled.div`
  color: #555;
  margin: 8px 0;
  font-weight: ${(props) => (props.bold ? '700' : 'normal')};
`;

const MarksTable = styled.table`
  width: 80%;
  margin-top: 20px;
  border-collapse: collapse;
  font-size: 1rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #f4f4f4;
  color: #333;
  text-align: left;
  font-weight: 700;
  border: 1px solid #ddd;
  text-transform: uppercase;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:nth-child(odd) {
    background-color: #fff;
  }
`;

const TableData = styled.td`
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
`;

const TotalMarksContainer = styled.div`
  width: 80%;
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  font-size: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const VerificationPage = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certificateResponse = await axios.get(
          `http://localhost:8000/certificates/get/${certificateId}`
        );
        if (certificateResponse.data) {
          setCertificate(certificateResponse.data);
          const studentResponse = await axios.get(
            `http://localhost:8000/student/get/${certificateResponse.data.StudentId}`
          );
          if (studentResponse.data) {
            setStudent(studentResponse.data);
          } else {
            setError('Error fetching student data');
          }
        } else {
          setError('Error fetching certificate data');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [certificateId]);

  const calculateTotals = () => {
    if (!certificate || !certificate.Marks) return { totalMarks: 0, obtainedMarks: 0 };
    const totalMarks = certificate.Marks.reduce((acc, mark) => acc + mark.totalMark, 0);
    const obtainedPracticalMark = certificate.Marks.reduce((acc, mark) => acc + mark.obtainedPracticalMark, 0);
    const obtainedTheoryMark = certificate.Marks.reduce((acc, mark) => acc + mark.obtainedTheoryMark, 0);
    return { totalMarks, obtainedPracticalMark, obtainedTheoryMark };
  };

  const { totalMarks, obtainedPracticalMark, obtainedTheoryMark } = calculateTotals();

  if (loading) {
    return <MainDashboard>Loading...</MainDashboard>;
  }

  if (error) {
    return <ErrorText>Error: {error}</ErrorText>;
  }

  return (
    <VerificationContainer>
      <Title>Certificate Verification</Title>
      <CertificateDetails>
        <Main>
          <InputContainer>
            <DetailItem bold>Certificate ID:</DetailItem>
            <DetailItem>{certificate?.CertificateId}</DetailItem>
          </InputContainer>

          <InputContainer>
            <DetailItem bold>Student Name:</DetailItem>
            <DetailItem>{student?.Name}</DetailItem>
          </InputContainer>

          <InputContainer>
            <DetailItem bold>Guardian Name:</DetailItem>
            <DetailItem>{student?.GuardianDetails[0]?.GName}</DetailItem>
          </InputContainer>

          <InputContainer>
            <DetailItem bold>Course Duration:</DetailItem>
            <DetailItem>{student?.Course[0]?.CourseDuration}</DetailItem>
          </InputContainer>

          <InputContainer>
            <DetailItem bold>Date of Issue:</DetailItem>
            <DetailItem>{certificate?.Date}</DetailItem>
          </InputContainer>

          <InputContainer>
            <DetailItem bold>Franchise ID:</DetailItem>
            <DetailItem>{certificate?.FranchiseId}</DetailItem>
          </InputContainer>
        </Main>
      </CertificateDetails>

      {/* Marks Table */}
      <MarksTable>
        <thead>
          <tr>
            <TableHeader>Subject</TableHeader>
            <TableHeader>Total Marks</TableHeader>
            <TableHeader>Theory Marks</TableHeader>
            <TableHeader>Practical Marks</TableHeader>
            <TableHeader>Total</TableHeader>
          </tr>
        </thead>
        <tbody>
          {certificate?.Marks?.map((mark) => (
            <TableRow key={mark._id}>
              <TableData>{mark.topic}</TableData>
              <TableData>{mark.totalMark}</TableData>
              <TableData>{mark.obtainedTheoryMark}</TableData>
              <TableData>{mark.obtainedPracticalMark}</TableData>
              <TableData>{mark.obtainedPracticalMark + mark.obtainedTheoryMark}</TableData>
            </TableRow>
          ))}
        </tbody>
      </MarksTable>

      {/* Total Marks Section */}
      <TotalMarksContainer>
        <Main1>
          <InputContainer>
            <DetailItem bold>Total Marks:</DetailItem>
            <DetailItem>{totalMarks}</DetailItem>
          </InputContainer>
          <InputContainer>
            <DetailItem bold>Obtained Marks:</DetailItem>
            <DetailItem>{obtainedPracticalMark + obtainedTheoryMark}</DetailItem>
          </InputContainer>
          <InputContainer>
            <DetailItem bold>Grade:</DetailItem>
            <DetailItem>{certificate?.Grade}</DetailItem>
          </InputContainer>
          <InputContainer>
            <DetailItem bold>Percentage:</DetailItem>
            <DetailItem>{certificate?.Percentage}%</DetailItem>
          </InputContainer>
        </Main1>
      </TotalMarksContainer>
    </VerificationContainer>
  );
};

export default VerificationPage;
