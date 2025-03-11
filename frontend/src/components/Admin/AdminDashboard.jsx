import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaUserGraduate,
  FaSchool,
  FaChalkboardTeacher,
  FaBook,
} from "react-icons/fa";
import DynamicChart from "./Dashboard/Chart";
import FeePaymentChart from "./Dashboard/FeePaymentCharts";
import AbsentStaffList from "./Dashboard/AbsentStaffList";
import AbsentStudentList from "./Dashboard/AbsentStudentList";
import NewAdmissions from "./Dashboard/NewAdmissions";
import { MainDashboard } from "../Styles/GlobalStyles";
import { Link } from "react-router-dom";
import FranchiseChart from "./Dashboard/FranchiseChart";

// Styled components
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

const BoxSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;

  /* Tablet View */
  @media (max-width: 768px) {
    gap: 15px;
    justify-content: center; /* Center items on tablet */
  }

  /* Mobile View */
  @media (max-width: 480px) {
    gap: 10px;
    flex-direction: column; /* Stack items vertically on mobile */
  }
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
    width: 100%;
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
    width: 250px; /* Full width on tablet */
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

const DashboardSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  /* Tablet View */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }

  /* Mobile View */
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const AdminDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalFranchise, setTotalFranchise] = useState(0);
  const [totalTeacher, setTotalTeacher] = useState(0);
  const [totalCourse, setTotalCourse] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/student/all");
        const data = await response.json();
        if (Array.isArray(data)) {
          setTotalStudents(data.length);
        } else {
          console.error("Unexpected response format", data);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalFranchise = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/franchise/all");
        const data = await response.json();
        if (Array.isArray(data)) {
          setTotalFranchise(data.length);
        } else {
          console.error("Unexpected response format", data);
        }
      } catch (error) {
        console.error("Error fetching franchise data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalTeacher = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/teacher/all");
        const data = await response.json();
        if (Array.isArray(data)) {
          setTotalTeacher(data.length);
        } else {
          console.error("Unexpected response format", data);
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalCourse = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/course/all");
        const data = await response.json();
        if (Array.isArray(data)) {
          setTotalCourse(data.length);
        } else {
          console.error("Unexpected response format", data);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalTeacher();
    fetchTotalFranchise();
    fetchTotalStudents();
    fetchTotalCourse();
  }, []);

  return (
    <MainDashboard>
      {/* Stats and FeePaymentChart on the left side */}
      <DashboardSection>
        <div style={{ flex: 1 }}>
          <StatsContainer>
            <StyledLink to="/admin/allstudent" backgroundColor="white">
              <IconWrapper>
                <FaUserGraduate />
              </IconWrapper>
              <StatTitle>Total Students</StatTitle>
              <StatValue>{loading ? "Loading..." : totalStudents}</StatValue>
            </StyledLink>
            <StyledLink to="/admin/allfranchise" backgroundColor="white">
              <IconWrapper>
                <FaSchool />
              </IconWrapper>
              <StatTitle>Total Franchise</StatTitle>
              <StatValue>{loading ? "Loading..." : totalFranchise}</StatValue>
            </StyledLink>
            <StyledLink to="/admin/allteacher" backgroundColor="white">
              <IconWrapper>
                <FaChalkboardTeacher />
              </IconWrapper>
              <StatTitle>Total Teachers</StatTitle>
              <StatValue>{loading ? "Loading..." : totalTeacher}</StatValue>
            </StyledLink>
            <StyledLink to="/admin/allcourse" backgroundColor="white">
              <IconWrapper>
                <FaBook />
              </IconWrapper>
              <StatTitle>Total Courses</StatTitle>
              <StatValue>{loading ? "Loading..." : totalCourse}</StatValue>
            </StyledLink>
          </StatsContainer>
        </div>
        <div style={{ flex: 1 }}>
          <FeePaymentChart />
        </div>
      </DashboardSection>

      {/* Dynamic charts and new admissions on the right side */}
      <BoxSection>
        <Box>
          <DynamicChart />
        </Box>
        <Box>
          <FranchiseChart />
        </Box>
      </BoxSection>

      {/* Absent lists section */}
      <BoxSection>
        <Box>
          <AbsentStaffList />
          <AbsentStudentList />
        </Box>
        <Box>
          <NewAdmissions />
        </Box>
      </BoxSection>
    </MainDashboard>
  );
};

export default AdminDashboard;
