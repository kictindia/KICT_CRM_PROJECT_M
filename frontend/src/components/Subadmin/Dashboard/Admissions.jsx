import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  width: 100%;
  margin: auto;
  font-family: "Arial", sans-serif;
  background-color: #fff;
  @media (max-width: 468px) {
    padding-bottom: 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  color: #1a237e;
  margin-bottom: 20px;
  @media (max-width: 468px) {
    font-size: 14px;
    padding: 10px;
    margin-bottom: 10px;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  justify-items: center;
  @media (max-width: 468px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 95px;
  text-align: center;
  @media (max-width: 468px) {
    width: 80%;
    height: 120px;
    padding: 4px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const PhotoContainer = styled.div`
  text-align: center;
`;

const Photo = styled.img`
  width: 40px;
  height: 40px;
  background-color: gray;
  border-radius: 50%;
`;

const StudentID = styled.h4`
  margin: 0;
  font-size: 14px;
  color: #333;
  @media (max-width: 468px) {
    font-size: 12px;
  }
`;

const StudentInfo = styled.p`
  font-size: 12px;
  color: #666;
  margin: 5px 0;
  @media (max-width: 468px) {
    font-size: 10px;
  }
`;

const Admissions = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const franchiseId = localStorage.getItem("Id"); // Retrieve franchiseId from localStorage
        if (!franchiseId) {
          setError("FranchiseId is not available in localStorage");
          return;
        }

        const response = await fetch('http://localhost:8000/student/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        console.log('Fetched students:', data);

        // Filter students by matching the franchiseId
        const filteredStudents = data.filter(student => student.FranchiseId === franchiseId);

        // Sort students by admission date in descending order (most recent first)
        const sortedStudents = filteredStudents.sort((a, b) => {
          const admissionDateA = new Date(a.DateofAdmission);
          const admissionDateB = new Date(b.DateofAdmission);
          return admissionDateB - admissionDateA; // Sorting in descending order
        });

        const reversedStudents = sortedStudents.reverse();
        
        // Limit to the most recent 6 students
        const limitedStudents = sortedStudents.slice(0, 6);

        console.log('Limited students:', limitedStudents);

        setStudents(limitedStudents);
      } catch (error) {
        setError("Error fetching students data");
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <Container>Loading students...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  return (
    <Container>
      <SectionTitle>New Admission</SectionTitle>
      <CardGrid>
        {students.length > 0 ? (
          students.map((student) => (
            <Card key={student._id}>
              <PhotoContainer>
                <Photo src={`http://localhost:8000/uploads/${student?.Image}`} alt="Student" />
              </PhotoContainer>
              <StudentID>Student ID: {student.StudentID}</StudentID>
              <StudentInfo>Name: {student.Name}</StudentInfo>
              {/* Display the first course name */}
              <StudentInfo>Course: {student.Course && student.Course[0]?.CourseName}</StudentInfo>
            </Card>
          ))
        ) : (
          <StudentInfo>No admissions available.</StudentInfo>
        )}
      </CardGrid>
    </Container>
  );
};

export default Admissions;
