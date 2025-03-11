import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Student from "./Dashboard/Studenta";
import Courses from "./Dashboard/Courses";
import { MainDashboard } from "../Styles/GlobalStyles";


const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  justify-items: center;
  align-items: center;
  margin-bottom: 20px;

  /* Tablet View */
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr; /* Stack two stats */
    gap: 10px;
  }

  /* Mobile View */
  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* Stack all stats vertically */
    gap: 15px;
  }
`;


const StatTitle = styled.h4`
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
`;

const StatValue = styled.p`
  font-size: 22px;
  font-weight: bold;
  color: #333;
`;

const Box = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 1rem auto;

  /* Tablet View */
  @media (max-width: 768px) {
    flex: 0 0 48%; /* Two boxes per row on tablet */
  }

  /* Mobile View */
  @media (max-width: 480px) {
    padding: 15px; /* Reduce padding on mobile */
    width: 90%;
  }
`;

const StyledLink = styled(Link)`
  width: 90%;
  padding: 20px;
  background-color: ${(props) => props.backgroundColor || "#f9f9f9"};
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
  margin: 0 auto;
  border: 0.1px black solid;

  /* Tablet View */
  @media (max-width: 768px) {
    width: 100%; /* Full width on tablet */
  }

  /* Mobile View */
  @media (max-width: 480px) {
    padding: 15px; /* Adjust padding for mobile */
  }

  &:hover {
    background-color: ${(props) => props.hoverColor || "#b4cef0"};
    border: none;
  }
`;


const TeacherDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0); // New state for total batches
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherId = localStorage.getItem("Id");
        if (!teacherId) {
          console.error("TeacherId is not available in localStorage");
          return;
        }

        // Fetch teacher data based on teacherId
        const teacherResponse = await fetch(
          `http://localhost:8000/teacher/get/${teacherId}`
        );
        if (!teacherResponse.ok) {
          throw new Error("Error fetching teacher data");
        }
        const teacherData = await teacherResponse.json();
        setTeacher(teacherData);

        // Fetch batches related to this teacher's franchise
        const batchResponse = await fetch("http://localhost:8000/batch/all");
        if (!batchResponse.ok) {
          throw new Error("Error fetching batch data");
        }
        const batchData = await batchResponse.json();

        // Filter batches based on the teacher's franchiseId
        const teacherFranchiseId = teacherData.FranchiseId;
        const filteredBatches = batchData.filter(
          (batch) => batch.FranchiseId === teacherFranchiseId
        );

        // Set the total number of batches
        setTotalBatches(filteredBatches.length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeacherData();
  }, []);

  return (
    <MainDashboard>
      {/* Stats Section */}
      <StatsContainer>
        <StyledLink backgroundColor="#e0e0e0">
          <StatTitle>Total Students</StatTitle>
          <StatValue>{totalStudents}</StatValue>
        </StyledLink>
        <StyledLink backgroundColor="#d0d0d0">
          <StatTitle>Total Batch</StatTitle>
          <StatValue>{totalBatches}</StatValue>{" "}
          {/* Display the count of batches */}
        </StyledLink>
      </StatsContainer>

      {/* Content Section */}
      <Box>
        <Student setStudentCount={setTotalStudents} />
        <Courses />
      </Box>
    </MainDashboard>
  );
};

export default TeacherDashboard;
