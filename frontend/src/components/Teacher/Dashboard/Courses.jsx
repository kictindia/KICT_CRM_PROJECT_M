import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  width: 100%;
  height: auto;
  padding: 1rem;
  margin: auto;
  font-family: "Arial", sans-serif;
  background-color: #fff;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.8rem;
  }

  @media (max-width: 468px) {
    padding-bottom: 10px;
    width: 100%;
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

const CourseList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
  @media (max-width: 468px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const CourseCard = styled.div`
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 250px;
  text-align: center;
  @media (max-width: 468px) {
    width: 80%;
    padding: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const CourseTitle = styled.h4`
  font-size: 16px;
  color: #333;
`;

const CourseInfo = styled.p`
  font-size: 14px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
  text-align: center;
`;

const LoadingMessage = styled.div`
  font-size: 16px;
  text-align: center;
`;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherAndCourses = async () => {
      try {
        const teacherId = localStorage.getItem("Id"); // Retrieve teacherId from localStorage

        if (!teacherId) {
          setError("TeacherId is not available in localStorage");
          return;
        }

        // Fetch teacher data based on teacherId
        const teacherResponse = await fetch(`http://localhost:8000/teacher/all`);
        if (!teacherResponse.ok) {
          throw new Error("Error fetching teacher data");
        }
        const teacherData = await teacherResponse.json();
        
        // Find the teacher by teacherId
        const loggedInTeacher = teacherData.find((teacher) => teacher.TeacherID === teacherId);
        
        if (!loggedInTeacher) {
          setError("Teacher not found");
          return;
        }

        setTeacher(loggedInTeacher);

        // Fetch courses data based on teacher's courses (Role)
        const courseData = loggedInTeacher.Role;
        if (courseData.length === 0) {
          setError("No courses found for this teacher");
          return;
        }

        setCourses(courseData); // Set the teacher's courses

      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAndCourses();
  }, []);

  if (loading) {
    return <LoadingMessage>Loading courses...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <SectionTitle>Courses Under {teacher ? teacher.Name : "Teacher"}</SectionTitle>
      {courses.length > 0 ? (
        <CourseList>
          {courses.map((course, index) => (
            <CourseCard key={index}>
              <CourseTitle>{course}</CourseTitle>
              <CourseInfo>Course Name: {course}</CourseInfo>
            </CourseCard>
          ))}
        </CourseList>
      ) : (
        <CourseInfo>No courses found for this teacher</CourseInfo>
      )}
    </Container>
  );
};

export default Courses;
