import { useState, useEffect } from "react";
import styled from "styled-components";
import { BsArrowReturnRight } from "react-icons/bs";
import { useLocation } from "react-router-dom";

// Styled components
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
  margin: 10px 0;
`;

const PhotoContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Photo = styled.img`
  width: 115px;
  height: 110px;
  background-color: gray;
  border-radius: 50%;
`;

const ViewPendingStudent = () => {
  const location = useLocation();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.Id) {
      const fetchStudent = async () => {
        try {
          const response = await fetch(`http://localhost:8000/pending-student/get/${location.state.Id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setStudent(data);
        } catch (error) {
          console.error("Error fetching student data:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    } else {
      console.error("Student ID not provided.");
      setError("Student ID not provided.");
      setLoading(false);
    }
  }, [location.state]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MainDashboard>
      <Container>
        <AdmissionLetterContainer>
          <PhotoContainer>
            {/* Assuming you have a field `student?.Image` for the photo */}
            <Photo src={`http://localhost:8000/uploads/${student?.Image}`} alt="Student" />
          </PhotoContainer>

          <Section>
            {/* Left Column for Student Info */}
            <Column>
              <Label>Student ID:</Label>
              <Value>
                &nbsp;{student?.StudentID || 'Not assigned'}
              </Value>
              <Hr/>

              <Label>Registration Number:</Label>
              <Value>

                &nbsp;{student?.RegistrationNumber || 'Not available'}
              </Value>
              <Hr/>

              <Label>Aadhaar Number:</Label>
              <Value>

                &nbsp;{student?.AadhaarNumber || 'Not available'}
              </Value>
              <Hr/>

              <Label>Date of Admission:</Label>
              <Value>

                &nbsp;{student?.DateofAdmission || 'Not available'}
              </Value>
              <Hr/>

              <Label>Branch:</Label>
              <Value>

                &nbsp;{student?.Branch || 'Not available'}
              </Value>
              <Hr/>

              <Label>Name:</Label>
              <Value>

                &nbsp;{student?.Name || 'Not available'}
              </Value>
            </Column>

            {/* Left Column for Contact Info */}
            <Column>
              <Label>Gender:</Label>
              <Value>

                &nbsp;{student?.Gender || 'Not available'}
              </Value>
              <Hr/>

              <Label>DOB:</Label>
              <Value>

                &nbsp;{student?.DOB || 'Not available'}
              </Value>
              <Hr/>

              <Label>Mobile No:</Label>
              <Value>

                &nbsp;{student?.MobileNo || 'Not available'}
              </Value>
              <Hr/>

              <Label>Alter Mobile No:</Label>
              <Value>

                &nbsp;{student?.AlterMobileNo || 'Not available'}
              </Value>
              <Hr/>

              <Label>Address:</Label>
              <Value>

                &nbsp;{student?.Address || 'Not available'}
              </Value>
              <Hr/>
            </Column>

            {/* Left Column for Additional Info */}
            <Column>
              <Label>Country:</Label>
              <Value>

                &nbsp;{student?.Country || 'Not available'}
              </Value>
              <Hr/>

              <Label>State:</Label>
              <Value>

                &nbsp;{student?.State || 'Not available'}
              </Value>
              <Hr/>

              <Label>Pincode:</Label>
              <Value>

                &nbsp;{student?.Pincode || 'Not available'}
              </Value>
              <Hr/>

              <Label>Area:</Label>
              <Value>

                &nbsp;{student?.Area || 'Not available'}
              </Value>
              <Hr/>

              <Label>Qualification:</Label>
              <Value>

                &nbsp;{student?.Qualification || 'Not available'}
              </Value>
              <Hr/>
            </Column>
          </Section>
          <Hr/>
          <Section>

            {/* Guardian Details */}
            {student?.GuardianDetails && student.GuardianDetails.length > 0 && (
              <Column>
                <Label>Guardian Name:</Label>
                <Value>

                  &nbsp;{student.GuardianDetails[0]?.GName || 'Not available'}
                </Value>
              <Hr/>

                <Label>Guardian Mobile No:</Label>
                <Value>

                  &nbsp;{student.GuardianDetails[0]?.GMobileNo || 'Not available'}
                </Value>
              <Hr/>

                <Label>Guardian Occupation:</Label>
                <Value>

                  &nbsp;{student.GuardianDetails[0]?.GOccupation || 'Not available'}
                </Value>
              <Hr/>
              </Column>
            )}
            {/* Course Details */}
            {student?.Course && student.Course.length > 0 && (
              <Column>
                <Label>Course Name:</Label>
                <Value>

                  &nbsp;{student.Course[0]?.CourseName || 'Not available'}
                </Value>
              <Hr/>

                <Label>Course Duration:</Label>
                <Value>

                  &nbsp;{student.Course[0]?.CourseDuration || 'Not available'}
                </Value>
              <Hr/>

                <Label>Fee:</Label>
                <Value>

                  &nbsp;{student.Course[0]?.Fee || 'Not available'}
                </Value>
              <Hr/>

                <Label>Slot:</Label>
                <Value>

                  &nbsp;{student.Course[0]?.Slot || 'Not available'}
                </Value>
              <Hr/>
              </Column>
            )}
          </Section>
        </AdmissionLetterContainer>
      </Container>
    </MainDashboard >
  );
};

export default ViewPendingStudent;
