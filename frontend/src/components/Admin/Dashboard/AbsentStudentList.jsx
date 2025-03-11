import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Styled Components
const Wrapper = styled.div`
  width: 90%;
  margin: auto;
  margin-top: 20px;
  @media (max-width: 480px) {
    width: 100%;
    margin: 0;
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

const Photo = styled.img`
  width: 60px;
  height: 60px;
  background-color: gray;
  border-radius: 50%;
`;

const AbsentStudentList = () => {
    const [absentStudents, setAbsentStudents] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state for fetching
    const [error, setError] = useState(null); // Error state for handling errors

    useEffect(() => {
        const fetchAbsentStudents = async () => {
            try {
                console.log("Fetching attendance data...");

                // Fetching attendance data
                const attendanceResponse = await fetch("https://franchiseapi.kictindia.com/student-attendance/all");
                if (!attendanceResponse.ok) {
                    throw new Error("Failed to fetch attendance data");
                }

                const attendanceData = await attendanceResponse.json();
                console.log("Attendance data fetched:", attendanceData); // Log the data to check its structure

                // Get today's date in YYYY-MM-DD format
                const today = new Date().toISOString().split("T")[0];

                // Loop through attendanceData and apply Class/Section before filtering
                const absentStudentsList = attendanceData
                    .filter(entry => entry.Date === today) // Check if the Date matches today
                    .flatMap(entry =>
                        entry.Attendance.filter(student => student.Status === "Absent").map(student => ({
                            name: student.Name,
                            studentId: student.StudentId,
                            status: student.Status,
                            batch: entry.Batch.Name, // Batch info (time slot) can be used as class info
                            image: student?.Image, // Default image if no student photo
                        }))
                    );

                console.log("Absent students data:", absentStudentsList); // Log to see all students

                // Fetch the individual images for each student
                const studentsWithImages = await Promise.all(
                    absentStudentsList.map(async (student) => {
                        try {
                            const studentResponse = await fetch(
                                `https://franchiseapi.kictindia.com/student/get/${student.studentId}`
                            );
                            if (!studentResponse.ok) {
                                throw new Error(`Failed to fetch image for student ID ${student.studentId}`);
                            }

                            const studentData = await studentResponse.json();
                            return { ...student, image: studentData?.Image || student.Image };
                        } catch (error) {
                            console.error(error);
                            return student; // In case of error, return the original student data
                        }
                    })
                );

                setAbsentStudents(studentsWithImages); // Set state with student data and images
            } catch (error) {
                setError("Error fetching absent students data");
                console.error("Error fetching absent students:", error);
            } finally {
                setLoading(false); // Stop loading once data is fetched or error occurs
            }
        };

        fetchAbsentStudents();
    }, []); // Empty dependency array ensures this runs once on component mount

    // Loading state
    if (loading) {
        return <Wrapper>Loading absent students...</Wrapper>;
    }

    // Error state
    if (error) {
        return <Wrapper>{error}</Wrapper>;
    }

    return (
        <Wrapper>
            <HeaderTitle>Today's Absent Students</HeaderTitle>
            <StyledTable>
                <TableHead>
                    <tr>
                        <HeadCell>Profile Picture</HeadCell>
                        <HeadCell>Name</HeadCell>
                        <HeadCell>Student ID</HeadCell>
                        <HeadCell>Batch</HeadCell>
                    </tr>
                </TableHead>
                <TableBody>
                    {absentStudents.length === 0 ? (
                        <tr>
                            <BodyCell colSpan="4" style={{ textAlign: "center" }}>
                                No absent students today.
                            </BodyCell>
                        </tr>
                    ) : (
                        absentStudents.map((student, index) => (
                            <tr key={index}>
                                <BodyCell>
                                    <Photo
                                        src={`https://franchiseapi.kictindia.com/uploads/${student.image}`}
                                        alt="Student"
                                    />
                                </BodyCell>
                                <BodyCell>{student.name}</BodyCell>
                                <BodyCell>{student.studentId}</BodyCell> {/* Display Student ID */}
                                <BodyCell>{student.batch}</BodyCell> {/* Display Batch */}
                            </tr>
                        ))
                    )}
                </TableBody>
            </StyledTable>
        </Wrapper>
    );
};

export default AbsentStudentList;
