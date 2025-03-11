import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Link } from "react-router-dom";
import AttendanceChart from "./Dashboard/AttendanceChart";
import axios from "axios";
import { FaBook } from "react-icons/fa";


// Registering necessary chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// Main content area (dashboard)
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

// Chart section for displaying charts
const ChartSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: space-between;
  margin-bottom: 20px;
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
  border: 1px black solid;

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

const IconWrapper = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
`;

const StudentDashboard = () => {
  const [totalCourses, setTotalCourses] = useState(0);
  const studentId = localStorage.getItem('Id');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`https://franchiseapi.kictindia.com/student/get/${studentId}`);

        // Extract the number of courses from the "Course" array
        const courses = response.data.Course || [];
        setTotalCourses(courses.length); // Set the course count
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (studentId) {
      fetchStudentData(); // Fetch the student data if studentId exists
    }
  }, [studentId]);
  return (
    <MainDashboard>
      <StatsContainer>
        <StyledLink backgroundColor="#e0e0e0">
          <IconWrapper>
            <FaBook />
          </IconWrapper>
          <StatTitle>Total Courses Enrolled</StatTitle>
          <StatValue>{totalCourses}</StatValue>
        </StyledLink>
      </StatsContainer>

      <ChartSection>
        <AttendanceChart />
      </ChartSection>

    </MainDashboard>
  );
};

export default StudentDashboard;
