import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Eye, Trash2 } from "lucide-react";

const Wrapper = styled.div`
  width: 90%;
  margin: auto;
  margin-top: 20px;
  @media (max-width: 480px) {
    width: 100%;
    margin: 0;
    margin-bottom: 20px;
  }
`;

const HeaderTitle = styled.h2`
  font-size: 20px;
  color: #1a237e;
  margin-bottom: 20px;
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background-color: #f0f0f0;
`;

const HeadCell = styled.th`
  padding: 12px 15px;
  text-align: left;
  color: #666;
  font-weight: bold;
  @media (max-width: 480px) {
    font-size: 10px;
    padding: 8px 8px;
  }
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const BodyCell = styled.td`
  padding: 12px 15px;
  text-align: left;
  font-size: 16px;
  color: #333;
  @media (max-width: 480px) {
    font-size: 10px;
    padding: 8px 8px;
  }
`;

const Photo = styled.img`
  width: 60px;
  height: 60px;
  background-color: gray;
  border-radius: 50%;
`;

const DeleteButton = styled.div`
  background-color: red;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  width: 20%;
  display: flex;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  @media (max-width: 480px) {
    height: 2rem;
    width: 2rem;
    padding: 1px 0;
  }
`;

const AbsentStaffList = () => {
  const [absentStaff, setAbsentStaff] = useState([]);

  useEffect(() => {
    const fetchAbsentStaff = async () =>  {
      try {
        const response = await fetch('https://franchiseapi.kictindia.com/staff-attendance/all');
        const data = await response.json();
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        const absentStaffList = data
          .filter(entry => entry.Date === today)
          .flatMap(entry => 
            entry.Attendance.filter(attendance => attendance.Status !== 'Present')
          );

        console.log(data); // Debug log

        // Fetch additional staff details using TeacherId
        const staffDetails = await Promise.all(absentStaffList.map(async (staff) => {
          const teacherId = staff.TeacherId; // Correctly reference TeacherId
          if (!teacherId) {
            console.warn('Missing TeacherId for staff:', staff);
            return null; // Skip staff with missing TeacherId
          }

          const employeeResponse = await fetch(`https://franchiseapi.kictindia.com/teacher/get/${teacherId}`);
          const employeeData = await employeeResponse.json();
          return {
            id: employeeData._id,
            name: employeeData.Name, 
            roleClass: Array.isArray(employeeData.Role) ? employeeData.Role.join(', ') : employeeData.Role, // Join array if it's an array
            image: employeeData.Image || 'https://via.placeholder.com/40', // Placeholder if no image
            mobileNo: employeeData.MobileNo, // Add any additional attributes you may need
            email: employeeData.Email // Add any additional attributes you may need
          };
        }));

        // Filter out any null values from staffDetails (e.g., if TeacherId was missing)
        setAbsentStaff(staffDetails.filter(staff => staff !== null));
      } catch (error) {
        console.error('Error fetching absent staff:', error);
      }
    };

    fetchAbsentStaff();
  }, []);

  return (
    <Wrapper>
      <HeaderTitle>Today's Absent Staff</HeaderTitle>
      <StyledTable>
        <TableHead>
          <tr>
            <HeadCell>Profile Picture</HeadCell>
            <HeadCell>Name</HeadCell>
            <HeadCell>Role/Class</HeadCell>
          </tr>
        </TableHead>
        <TableBody>
          {absentStaff.map((staff, index) => (
            <tr key={index}>
              <BodyCell><Photo src={`https://franchiseapi.kictindia.com/uploads/${staff?.image}`} alt="Staff" /></BodyCell>
              <BodyCell>{staff.name}</BodyCell>
              <BodyCell>{staff.roleClass}</BodyCell> {/* Displays roleClass as a comma-separated string */}
            </tr>
          ))}
        </TableBody>
      </StyledTable>
    </Wrapper>
  );
};

export default AbsentStaffList;
