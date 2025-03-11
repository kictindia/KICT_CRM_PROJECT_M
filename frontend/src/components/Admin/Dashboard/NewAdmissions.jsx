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

const NewAdmissions = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    var role = localStorage.getItem("Role");
    console.log(role);
    const fetchStudents = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/student/all");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // console.log('Fetched students:', data);
        var filterData = data.filter((data) => data.FranchiseId);

        // Sort students by admission date in ascending order (oldest first)
        const sortedStudents = data.sort((a, b) => {
          const admissionDateA = new Date(a.DateofAdmission);
          const admissionDateB = new Date(b.DateofAdmission);
          return admissionDateA - admissionDateB; // Sorting in ascending order
        });

        // Reverse the array to show the most recent students last
        const reversedStudents = sortedStudents.reverse();

        // Limit to the most recent 6 students
        const limitedStudents = reversedStudents.slice(0, 6);

        console.log("Limited students:", limitedStudents);

        setStudents(limitedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <Container>
      <SectionTitle>New Admission</SectionTitle>
      <CardGrid>
        {students.length > 0 ? (
          students.map((student) => (
            <Card key={student._id}>
              <PhotoContainer>
                <Photo
                  src={`https://franchiseapi.kictindia.com/uploads/${student?.Image}`}
                  alt="Student"
                />
              </PhotoContainer>
              <StudentID>Student ID: {student.StudentID}</StudentID>
              <StudentInfo>Name: {student.Name}</StudentInfo>
              {/* Display the first course name */}
              <StudentInfo>
                Course: {student.Course && student.Course[0]?.CourseName}
              </StudentInfo>
            </Card>
          ))
        ) : (
          <StudentInfo>No admissions available.</StudentInfo>
        )}
      </CardGrid>
    </Container>
  );
};

export default NewAdmissions;
