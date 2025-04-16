import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import StateData from "./../../assets/State.json";
import { Form, FormContainer, Heading, Input, InputContainer, Label, Main, MainDashboard, Section, SubmitButton, Title } from "../Styles/GlobalStyles";
import Snackbar from '@mui/material/Snackbar'; // Import MUI Snackbar
import MuiAlert from '@mui/material/Alert'; // Import MUI Alert

// Styled Components (same as before)...
const SelectInput = styled(Select)`
  width: 100%;
  border: 1px solid #001f3d;
  border-radius: 5px;
  font-size: 14px;
  @media (max-width: 480px) {
    height: 38px;
    width: 100%;
    font-size: 12px;
    padding: 0;
  }
`;

const Selects = styled.select`
  width: 100%;
  padding: 10px 20px;
  border: 1px solid #001f3d;
  border-radius: 5px;
  @media (max-width: 480px) {
    height: 38px;
    width: 100%;
    font-size: 12px;
    padding: 10px 12px;
  }
`;

const TableContainer = styled.div`
  margin-top: 30px;
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #001f3d;
  color: white;
`;

const TableRow = styled.tr`
  text-align: center;
`;

const TableData = styled.td`
  padding: 10px;
`;

const CreateSyllabusButton = styled.button`
  background-color: #12192c;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #597ad4;
    border: none;
    color: #12192c;
    padding: 8px 12px;
  }
`;

const AddCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [category, setCategory] = useState("");
  const [courseName, setCourseName] = useState("");
  const [franchiseId, setFranchiseId] = useState("");
  const [state, setState] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [stateData, setStateData] = useState([]);
  const [franchiseData, setFranchiseData] = useState([]);
  
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  
  useEffect(() => {
    const formattedData = Object.entries(StateData).map(([label, value]) => ({
      label: `${label}`,
      value: `${label}`,
    }));
    formattedData.unshift({
      label: "Select a State",
      value: "",
    });
    setStateData(formattedData);
  }, []);

  useEffect(() => {
    const fetchFran = async () => {
      try {
        const response = await axios.get("http://localhost:8000/franchise/all");
        const formattedData = response.data.map((franchise) => ({
          label: franchise.FranchiseName,
          value: franchise.FranchiseID,
        }));
        formattedData.unshift({
          label: "All Franchise",
          value: "All",
        });
        setFranchiseData(formattedData);
      } catch (error) {
        console.error("There was an error fetching the courses:", error);
      }
    };

    fetchFran();
  }, []);

  useEffect(() => {
    if (location.state && location.state.courseId) {
      setCourseId(location.state.courseId);
    }
  }, [location]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/course/all");
      if (response.status === 200) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error("There was an error fetching the courses:", error);
    }
  };
  
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStateChange = (selectedOption) => {
    setState(selectedOption.value);
  };

  const handelFranchise = (selectedOption) => {
    setFranchiseId(selectedOption.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      Category: category,
      CourseName: courseName,
      CourseDescription: courseDescription,
      CourseDuration: courseDuration,
      FranchiseId: franchiseId,
      State: state,
    };

    try {
      const response = await axios.post("http://localhost:8000/course/add", courseData);
      if (response.status === 201) {
        setSnackbarMessage("Course added successfully!"); // Set success message
        setOpenSnackbar(true); // Open the Snackbar
        setCourseId("");
        setCategory("");
        setCourseName("");
        setCourseDescription("");
        setCourseDuration("");
        setFranchiseId("");
        setState("");
        fetchCourses();
      } else {
        alert("Failed to add course. Please try again.");
      }
    } catch (error) {
      console.error("There was an error adding the course:", error);
      alert("Error occurred while adding the course.");
    }
  };

  const handleCreateSyllabus = (courseId) => {
    navigate(`/admin/createsyllabus/${courseId}`, {
      state: { courseId },
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the Snackbar
  };

  return (
    <MainDashboard>
      <FormContainer>
        <Title>Course Details</Title>
        <Form onSubmit={handleSubmit}>
          <Section>
            <Heading>Details</Heading>
          </Section>
          <Main>
            <InputContainer>
              <Label>Category</Label>
              <Selects value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Course</option>
                <option value="Basic Software">Basic Software</option>
                <option value="Graphic Software">Graphic Software</option>
                <option value="Interior Software">Interior Software</option>
                <option value="Programming">Programming</option>
                <option value="Other Software">Other Software</option>
                <option value="Combine Course">Combine Course</option>
              </Selects>
            </InputContainer>
            <InputContainer>
              <Label>Course Name</Label>
              <Input
                type="text"
                placeholder="Enter Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </InputContainer>
            <InputContainer>
              <Label>Course Description</Label>
              <Input
                type="text"
                placeholder="Enter Course Description"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              />
            </InputContainer>
            <InputContainer>
              <Label>Course Duration</Label>
              <Input
                type="text"
                placeholder="Enter Course Duration"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
              />
            </InputContainer>
            <InputContainer>
              <Label>Franchise</Label>
              <SelectInput
                options={franchiseData}
                onChange={handelFranchise}
                placeholder="Select a Franchise"
                isSearchable={true}
              />
            </InputContainer>
            <InputContainer>
              <Label>State</Label>
              <SelectInput
                options={stateData}
                onChange={handleStateChange}
                placeholder="Select a State"
                isSearchable={true}
              />
            </InputContainer>
          </Main>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <SubmitButton type="submit">Submit</SubmitButton>
          </div>
        </Form>

        {/* Table to display course details */}
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>Course ID</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Course Name</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Duration</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <TableRow key={index}>
                  <TableData>{course.CourseId}</TableData>
                  <TableData>{course.Category}</TableData>
                  <TableData>{course.CourseName}</TableData>
                  <TableData>{course.CourseDescription}</TableData>
                  <TableData>{course.CourseDuration}</TableData>
                  <TableData>
                    <CreateSyllabusButton onClick={() => handleCreateSyllabus(course.CourseId)}>
                      Create Syllabus
                    </CreateSyllabusButton>
                  </TableData>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </FormContainer>

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </MainDashboard>
  );
};

export default AddCourse;
