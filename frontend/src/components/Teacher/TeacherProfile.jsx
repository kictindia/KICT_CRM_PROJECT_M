import { useState, useEffect } from "react";
import styled from "styled-components";

// Styled components for styling
const MainDashboard = styled.div`
  flex: 1;
  padding: 20px;
  width: -webkit-fill-available;
  background-color: #f9f9f9;
  box-sizing: border-box;
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

// Styled components
const Container = styled.div`
  /* height: 100%; */
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f7fc;
  
`;

const AdmissionLetterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  margin-top: 30px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: center;
`;

const Section = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* Three columns */
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr; /* Two columns for medium screens */
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* One column for small screens */
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #666;
  margin: 0;
`;

const Value = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0;
  font-weight: 500;
`;

const Hr = styled.hr`
  border: 0;
  border-top: 1px solid black;
  margin:  0;
`;

const PhotoContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Photo = styled.img`
  /* width: 115px; */
  height: 110px;
  background-color: gray;
  /* border-radius: 50%; */
`;


const TeacherProfile = () => {
  const [franchise, setFranchise] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      const teacherId = localStorage.getItem("Id"); // Assuming Teacher ID is stored in localStorage

      if (teacherId) {
        try {
          const response = await fetch(`https://franchiseapi.kictindia.com/teacher/get/${teacherId}`);
          if (!response.ok) {
            throw new Error('Teacher not found');
          }
          const data = await response.json();
          setTeacher(data); // Set teacher data to state
        } catch (error) {
          setError(error.message); // Set error message
        } finally {
          setLoading(false); // Set loading to false when done
        }
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainDashboard>
      <Title>My Data</Title>
      <Container>
        <AdmissionLetterContainer>
          <PhotoContainer>
            {/* Assuming you have a field `teacher?.UPICode` for the teacher's photo */}
            <Photo src={`https://franchiseapi.kictindia.com/uploads/${teacher?.Image}`} alt="Teacher" />
          </PhotoContainer>

          {/* Teacher Details */}
          <Section>
            <Column>
              <Label>Teacher ID:</Label>
              <Value>{teacher?.TeacherID || "Not available"}</Value><Hr/>
            </Column>

            <Column>
              <Label>Name:</Label>
              <Value>{teacher?.Name || "Not available"}</Value><Hr/>
            </Column>

            <Column>
              <Label>Gender:</Label>
              <Value>{teacher?.Gender || "Not available"}</Value><Hr/>
            </Column>

            <Column>
              <Label>Date of Birth:</Label>
              <Value>{teacher?.DOB || "Not available"}</Value><Hr/>
            </Column>

            <Column>
              <Label>Date of Joining:</Label>
              <Value>{teacher?.DOJ || "Not available"}</Value><Hr/>
            </Column>

            <Column>
              <Label>Email:</Label>
              <Value>{teacher?.Email || "Not available"}</Value><Hr/>
            </Column>

            <Column>
              <Label>Mobile No:</Label>
              <Value>{teacher?.MobileNo || "Not available"}</Value><Hr/>
            </Column>

            <Column>
              <Label>Address:</Label>
              <Value>{teacher?.Address || "Not available"}</Value><Hr/>
            </Column>

            <Column>
              <Label>Salary:</Label>
              <Value>{teacher?.Salary || "Not available"}</Value><Hr/>
            </Column>
          </Section>

          {/* Student List
          <div>
            <h3>Students under {teacher?.Name}:</h3>
            {students.length > 0 ? (
              students.map((student) => (
                <StudentCard key={student._id}>
                  <StudentInfo>
                    <div><strong>Name:</strong> {student.Name}</div>
                    <div><strong>Email:</strong> {student.Email}</div>
                    <div><strong>Mobile No:</strong> {student.MobileNo}</div>
                    <div><strong>Enrollment Date:</strong> {student.EnrollmentDate}</div>
                    <div><strong>Address:</strong> {student.Address}</div>
                  </StudentInfo>
                </StudentCard>
              ))
            ) : (
              <p>No students found for this teacher.</p>
            )}
          </div> */}
        </AdmissionLetterContainer>
      </Container>
    </MainDashboard>
  );
};

export default TeacherProfile;
