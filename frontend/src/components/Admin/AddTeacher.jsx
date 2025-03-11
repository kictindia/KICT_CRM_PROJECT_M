import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Select from "react-dropdown-select";
import { useNavigate } from "react-router-dom";
import { Form, FormContainer, Heading, Input, InputContainer, Label, Main, MainDashboard, Section, SubmitButton, Title } from "../Styles/GlobalStyles";
// import Select from "react-select";


const Select1 = styled.select`
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

const SelectInput = styled(Select)`
    width: 35%;
  border: 1px solid #001f3d;
  border-radius: 5px;
  @media (max-width: 450px) {
    width: 100%;
  }

  &.react-select__control {
    border-radius: 30px;
    border: 2px solid #001f3d;
    box-shadow: none;
  }

  &.react-select__menu {
    border-radius: 10px;
    background-color: #f4f6fc;
  }

  &.react-select__option {
    font-size: 16px;
    font-weight: bold;
    color: #7a7a7a;
  }

  &.react-select__option--is-selected {
    background-color: #001f3d;
    color: white;
  }

  &.react-select__indicator {
    color: #001f3d;
  }

  &.react-select__dropdown-indicator {
    padding: 10px;
    cursor: pointer;
  }

  &.react-select__clear-indicator {
    padding: 10px;
  }
`;


const AddTeacher = () => {
  const [franchises, setFranchises] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Gender: "",
    DOB: "",
    DOJ: "",
    Email: "",
    MobileNo: "",
    Address: "",
    Roles: [],
    Salary: "",
    FranchiseName: "",
    FranchiseId: "",
    image: null,
  });

  const [userRole, setUserRole] = useState(null);
  const [courses, setCourses] = useState([]);
  const [myCourse, setMyCourse] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("Role");
    setUserRole(role);

    const fetchFranchises = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/franchise/all");
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setFranchises(data);
        }
      } catch (error) {
        console.error("Error fetching franchises:", error);
      }
    };

    fetchFranchises();

    // If the user is a Franchise, get the franchise data from localStorage
    if (role === "Franchise") {
      const franchiseData = JSON.parse(localStorage.getItem("FranchiseData"));
      if (franchiseData) {
        setFormData((prevData) => ({
          ...prevData,
          FranchiseName: franchiseData.FranchiseName,
          FranchiseId: franchiseData.FranchiseID,
        }));
      }
    }
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/Course/all");
        const data = await response.json();

        if (data && Array.isArray(data)) {
          const courseOptions = data.map(course => ({
            value: course.CourseName,
            label: course.CourseName
          }));
          setCourses(courseOptions);
        }
      } catch (error) {
        console.error("Error fetching franchises:", error);
      }
    };

    fetchCourse();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData)
    console.log(myCourse)
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleFranchiseChange = (e) => {
    const selectedFranchise = franchises.find(
      (franchise) => franchise.FranchiseName === e.target.value
    );
    setFormData({
      ...formData,
      FranchiseName: e.target.value,
      FranchiseId: selectedFranchise ? selectedFranchise.FranchiseID : "",
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check the user role and adjust formData for Franchise
    if (userRole === "Franchise") {
      // Retrieve the Franchise ID from localStorage
      const franchiseData = localStorage.getItem("Id");
  
      // If franchiseData exists, use it as the FranchiseId
      if (franchiseData) {
        // Assuming 'franchiseData' is just the FranchiseID (string)
        formData.FranchiseId = franchiseData;  // Directly assign the FranchiseId
      }
    }
  
    // Prepare the form data for submission
    const formToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      console.log(key);
      if (key === "Roles") {
        // If the key is 'Roles', append it as a JSON string (assuming it's an array)
        formToSend.append(key, JSON.stringify(myCourse));
      } else {
        // Append other form data as usual
        formToSend.append(key, formData[key]);
      }
    });
  
    try {
      // Make the API call to add a teacher
      const response = await axios.post(
        "https://franchiseapi.kictindia.com/teacher/add",
        formToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",  // Required for file upload
          },
        }
      );
  
      alert("Teacher added successfully!");
  
      // Reset formData after submission
      setFormData({
        Name: "",
        Gender: "",
        DOB: "",
        DOJ: "",
        Email: "",
        MobileNo: "",
        Address: "",
        Roles: [],
        Salary: "",
        FranchiseName: "",
        FranchiseId: "",
        image: null,
      });
  
      // Redirect based on user role (Admin or Franchise)
      if (userRole === "Admin") {
        navigate("/admin/allteacher");
      } else if (userRole === "Franchise") {
        navigate("/branch/allteacher");
      }
  
    } catch (error) {
      // Handle any errors during the submission
      console.error("Error adding teacher:", error);
      alert("Error adding teacher");
    }
  };
  

  return (
    <MainDashboard>
      <FormContainer>
        <Title>Teacher Details</Title>
        <Form onSubmit={handleSubmit}>
          <Section>
            <Heading>Details</Heading>
          </Section>
          <Main>
            <InputContainer>
              <Label>Teacher Name</Label>
              <Input
                type="text"
                name="Name"
                placeholder="Enter Teacher Name"
                value={formData.Name}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Gender</Label>
              <Select1
                name="Gender"
                value={formData.Gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select1>
            </InputContainer>
            <InputContainer>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Date of Joining</Label>
              <Input
                type="date"
                name="DOJ"
                value={formData.DOJ}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Salary</Label>
              <Input
                type="text"
                name="Salary"
                placeholder="Enter Salary"
                value={formData.Salary}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Email</Label>
              <Input
                type="email"
                name="Email"
                placeholder="Enter Email"
                value={formData.Email}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Mobile No</Label>
              <Input
                type="text"
                name="MobileNo"
                placeholder="Enter Mobile Number"
                value={formData.MobileNo}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Address</Label>
              <Input
                type="text"
                name="Address"
                placeholder="Enter Address"
                value={formData.Address}
                onChange={handleInputChange}
              />
            </InputContainer>

            {userRole !== "Franchise" && (
              <InputContainer>
                <Label>Franchise</Label>
                <Select1
                  name="FranchiseName"
                  value={formData.FranchiseName}
                  onChange={handleFranchiseChange}
                >
                  <option value="">Select Franchise</option>
                  {franchises.length > 0 ? (
                    franchises.map((franchise) => (
                      <option
                        key={franchise.FranchiseID}
                        value={franchise.FranchiseName}
                      >
                        {franchise.FranchiseName}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading franchises...</option>
                  )}
                </Select1>
              </InputContainer>
            )}
          </Main>

          <Section>
            <Heading>Profile Image</Heading>
          </Section>
          <Main>
            <InputContainer>
              <Label>Upload Image</Label>
              <Input type="file" name="image" onChange={handleFileChange} />
            </InputContainer>
            <InputContainer>
              <Label>Course Name</Label>
              <SelectInput style={{ padding: "11px 12px", border: "1px solid #001f3d" }}
                name="CourseName"
                options={courses}
                value={formData.Roles || []} // Ensure it's an array for multiple selections
                onChange={(selectedOptions) => setMyCourse(selectedOptions.map(cou => cou.value))} // Pass selected options to handler
                multi
              />
            </InputContainer>
          </Main>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <SubmitButton type="submit">Submit</SubmitButton>
          </div>
        </Form>
      </FormContainer>
    </MainDashboard>
  );
};

export default AddTeacher;
