import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import Dialog from '@mui/material/Dialog'; // Import Dialog component
import DialogActions from '@mui/material/DialogActions'; // Import DialogActions
import DialogContent from '@mui/material/DialogContent'; // Import DialogContent
import DialogTitle from '@mui/material/DialogTitle'; // Import DialogTitle
import Button from '@mui/material/Button'; // Import MUI Button

// Styled Components
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

const Title = styled.h2`
  color: #001f3d;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 25px;
`;

const CoursesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const CourseCard = styled.div`
  width: 200px;
  height: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  gap: 1rem;
  padding: 15px;
  font-family: "Arial", sans-serif;

  &:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Icon = styled.div`
  font-size: 40px;
`;

const CourseTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ButtonStyled = styled.button`
  background-color: ${(props) => props.color};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
`;

const Allcourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [courseToDelete, setCourseToDelete] = useState(null); // State for the course to delete
  const navigate = useNavigate();

  // Fetch courses from the API
  useEffect(() => {
    axios
      .get("https://franchiseapi.kictindia.com/course/all")
      .then((response) => {
        setCourses(response.data); // Set the courses data
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Handle button click (navigate to course details page)
  const handleDetailsClick = (courseId) => {
    navigate(`/admin/coursedetail/${courseId}`);
  };

  // Handle edit button click (navigate to the edit page)
  const handleEditClick = (courseId) => {
    navigate(`/admin/createsyllabus/${courseId}`, {
      state: { courseId } // Passing courseId through state
    });
  };

  // Handle delete button click, opens confirmation dialog
  const handleDeleteClick = (courseId) => {
    setCourseToDelete(courseId); // Store the courseId to be deleted
    setOpenDialog(true); // Open the confirmation dialog
  };

  // Confirm deletion and delete the course
  const confirmDelete = () => {
    axios
      .delete(`https://franchiseapi.kictindia.com/course/delete/${courseToDelete}`)
      .then((response) => {
        // Remove the deleted course from the UI without reloading the page
        setCourses(courses.filter((course) => course.CourseId !== courseToDelete));
        alert("Course deleted successfully!");
        setOpenDialog(false); // Close the dialog after deletion
      })
      .catch((err) => {
        console.error("Error deleting course:", err);
        alert("Failed to delete the course.");
        setOpenDialog(false); // Close the dialog if there's an error
      });
  };

  // Handle cancel action in the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  return (
    <MainDashboard>
      <Title>All Courses</Title>
      <CoursesContainer>
        {courses.map((course) => (
          <CourseCard key={course.CourseId}>
            <Icon>📚</Icon>
            <CourseTitle>{course.CourseName}</CourseTitle>
            <ButtonContainer>
              {/* Details Button */}
              <ButtonStyled color="#2b8b29" onClick={() => handleDetailsClick(course.CourseId)}>
                <Eye />
              </ButtonStyled>

              {/* Edit Button */}
              <ButtonStyled color="#42a5f5" onClick={() => handleEditClick(course.CourseId)}>
                <Edit />
              </ButtonStyled>

              {/* Delete Button */}
              <ButtonStyled color="#e74c3c" onClick={() => handleDeleteClick(course.CourseId)}>
                <Trash2 />
              </ButtonStyled>
            </ButtonContainer>
          </CourseCard>
        ))}
      </CoursesContainer>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Are you sure you want to delete this course?"}</DialogTitle>
        <DialogContent>
          <p>This action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainDashboard>
  );
};

export default Allcourse;
