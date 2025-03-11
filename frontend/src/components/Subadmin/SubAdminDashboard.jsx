import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
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
import FeeChart from "./Dashboard/FeeChart";
import FeePayment from "./Dashboard/FeePayment";
import AbsentTeacher from "./Dashboard/AbsentTeacher";
import AbsentStudent from "./Dashboard/AbsentStudent";
import Admissions from "./Dashboard/Admissions";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const MainDashboard = styled.div`
  flex: 1;
  padding: 30px;
  height: calc(100vh - 60px);
  box-sizing: border-box;
  background-color: #f9f9f9;
  overflow-y: auto;
  color: #333;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #cecece;
    border-radius: 10px;
  }

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

const IconWrapper = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
`;

const ChartSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBox = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h4`
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
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

const Box = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  width: 60%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Right = styled.div`
  width: 40%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SubAdminDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [franchiseId, setFranchiseId] = useState(null); // To store the franchiseId

  useEffect(() => {
    // Retrieve franchiseId from localStorage
    const storedFranchiseId = localStorage.getItem("Id");

    if (storedFranchiseId) {
      setFranchiseId(storedFranchiseId);
      fetchStats(storedFranchiseId); // Fetch stats after setting franchiseId
    } else {
      console.log("No franchiseId found in localStorage.");
    }
  }, []);

  // Function to fetch the stats based on franchiseId
  const fetchStats = async (franchiseId) => {
    try {
      // Fetching student count filtered by franchiseId
      const studentResponse = await axios.get(
        "https://franchiseapi.kictindia.com/student/all",
        {
          params: { franchiseId },
        }
      );

      // Fetching teacher count filtered by franchiseId
      const teacherResponse = await axios.get(
        "https://franchiseapi.kictindia.com/teacher/all",
        {
          params: { franchiseId },
        }
      );

      // Set the counts in state
      setTotalStudents(
        studentResponse.data.filter(
          (student) => student.FranchiseId === franchiseId
        ).length
      );
      setTotalTeachers(
        teacherResponse.data.filter(
          (teacher) => teacher.FranchiseId === franchiseId
        ).length
      );
    } catch (error) {
      console.error("Error fetching stats data:", error);
    }
  };

  return (
    <MainDashboard>
      {/* <Header>
        <SearchBar placeholder="Search..." />
      </Header> */}

      <StatsContainer>
        <StyledLink backgroundColor="white">
          <IconWrapper>
            <FaUserGraduate />
          </IconWrapper>
          <StatTitle>Total Students</StatTitle>
          <StatValue>{totalStudents}</StatValue>
        </StyledLink>
        <StyledLink backgroundColor="white">
          <IconWrapper>
            <FaChalkboardTeacher />
          </IconWrapper>
          <StatTitle>Total Teachers</StatTitle>
          <StatValue>{totalTeachers}</StatValue>
        </StyledLink>
      </StatsContainer>

      <ChartSection>
        <ChartBox>
          <ChartTitle>Fee Chart</ChartTitle>
          <FeeChart />
        </ChartBox>
        <ChartBox>
          <ChartTitle>Fee Payments</ChartTitle>
          <FeePayment />
        </ChartBox>
      </ChartSection>

      <Box>
        <Left>
          <AbsentTeacher />
          <AbsentStudent />
        </Left>
        <Right>
          <Admissions />
        </Right>
      </Box>
    </MainDashboard>
  );
};

export default SubAdminDashboard;
