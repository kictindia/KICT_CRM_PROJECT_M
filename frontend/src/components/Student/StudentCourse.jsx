import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

// Styled Components
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

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 20px;
`;

const CourseCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const CourseTitle = styled.h4`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const CourseDetails = styled.p`
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
`;

const Button = styled.button`
  background-color: #688AF6;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: #576bdb;
  }
`;

const Heading = styled.h1`
    text-align: center;
    margin: 2rem 0;
    color:#022186 ;
    font-size: 2rem;
`

const StudentCourse = () => {
    const [studentData, setStudentData] = useState(null);
    const [courseDetails, setCourseDetails] = useState([]);
    const studentId = localStorage.getItem('Id'); // Fetch studentId from localStorage
    const navigate = useNavigate(); // Use useNavigate to navigate to the ViewDetails page

    // Fetch student data and course details
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Fetch student data using studentId
                const studentResponse = await axios.get(`http://localhost:8000/student/get/${studentId}`);
                setStudentData(studentResponse.data);

                // Fetch course details for each course enrolled
                const enrolledCourses = studentResponse.data.Course || [];
                const courseRequests = enrolledCourses.map(course =>
                    axios.get(`http://localhost:8000/course/get/${course.CourseId}`)
                );

                // Wait for all course details to be fetched
                const courseResponses = await Promise.all(courseRequests);
                const courses = courseResponses.map(response => response.data);

                setCourseDetails(courses);
            } catch (error) {
                console.error('Error fetching student or course data:', error);
            }
        };

        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]);

    const handleViewDetails = (courseId) => {
        // Navigate to the ViewDetails page with the courseId as a URL parameter
        navigate(`/student/course/${courseId}`);
    };

    return (
        <MainDashboard>
            <Heading>Courses Enroll by {studentId}</Heading>
            <Container>
                {courseDetails.length > 0 ? (
                    courseDetails.map((course, index) => (
                        <CourseCard key={index}>
                            <CourseTitle>{course.CourseName}</CourseTitle>
                            <CourseDetails>{course.CourseDescription}</CourseDetails>
                            <CourseDetails>Duration: {course.CourseDuration}</CourseDetails>
                            <Button onClick={() => handleViewDetails(course.CourseId)}>View Details</Button>
                        </CourseCard>
                    ))
                ) : (
                    <p>No courses enrolled.</p>
                )}
            </Container>
        </MainDashboard>
    );
};

export default StudentCourse;
