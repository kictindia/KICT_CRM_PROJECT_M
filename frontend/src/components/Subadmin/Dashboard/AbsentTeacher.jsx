import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

const AbsentTeacher = () => {
    const [absentStaff, setAbsentStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAbsentStaff = async () => {
            try {
                // Retrieve the FranchiseId from localStorage
                const franchiseId = localStorage.getItem('Id');
                if (!franchiseId) {
                    setError('FranchiseId not found in localStorage');
                    return;
                }

                const response = await fetch('https://franchiseapi.kictindia.com/staff-attendance/all');
                const data = await response.json();
                const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

                // Filter the attendance data for today's date and the matching FranchiseId
                const absentStaffList = data
                    .filter(entry => entry.Date === today) // Ensure we're only considering today's date
                    .filter(entry => entry.FranchiseId === franchiseId) // Filter by FranchiseId
                    .flatMap(entry => 
                        entry.Attendance
                            .filter(attendance => attendance.Status === 'Absent') // Filter only absent teachers
                            .map(attendance => ({
                                TeacherId: attendance.TeacherId,
                                Name: attendance.Name,
                                Status: attendance.Status
                            }))
                    );

                // Fetch additional staff details using TeacherId
                const staffDetails = await Promise.all(absentStaffList.map(async (staff) => {
                    const teacherId = staff.TeacherId;
                    const employeeResponse = await fetch(`https://franchiseapi.kictindia.com/teacher/get/${teacherId}`);
                    const employeeData = await employeeResponse.json();
                    return {
                        id: employeeData._id,
                        name: employeeData.Name,
                        roleClass: Array.isArray(employeeData.Role) ? employeeData.Role.join(', ') : employeeData.Role, // Join array if it's an array
                        image: employeeData.Image || 'https://via.placeholder.com/40', // Placeholder if no image
                        mobileNo: employeeData.MobileNo,
                        email: employeeData.Email
                    };
                }));

                // Filter out any null values (e.g., if TeacherId was missing)
                setAbsentStaff(staffDetails.filter(staff => staff !== null));
            } catch (error) {
                setError('Error fetching absent staff data');
                console.error('Error fetching absent staff:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAbsentStaff();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                            <BodyCell>{staff.roleClass}</BodyCell>
                        </tr>
                    ))}
                </TableBody>
            </StyledTable>
        </Wrapper>
    );
};

export default AbsentTeacher;
