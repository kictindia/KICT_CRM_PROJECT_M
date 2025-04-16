// src/components/EditEnquiry.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from "styled-components";
import { useLocation } from 'react-router-dom'; // For accessing the enquiry id
import Select from "react-select";
import { Heading, SubmitButton } from '../Styles/GlobalStyles';

const Title = styled.h2`
  color: #001f3d;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 20px;
`;

const Form = styled.form`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row; /* Align radio buttons horizontally */
  gap: 20px; /* Space between radio buttons */
  align-items: center;
  margin-top: 15px;
  margin-left: 20px;
`;

// Custom radio button styling
const RadioButton = styled.input`
  position: relative;
  width: 18px;
  height: 18px;
  appearance: none;
  border-radius: 50%;
  border: 2px solid #001f3d;
  background-color: white;
  outline: none;
  cursor: pointer;
  margin-right: 8px;

  &:checked {
    background-color: #001f3d;
    border-color: #001f3d;
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
  }
`;

// Styled label for the radio button
const RadioLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #7a7a7a;
  cursor: pointer;

  &:hover {
    color: #001f3d;
  }
`;


const Section = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  @media (max-width:480px){
    grid-template-columns: repeat(1, 1fr);
  }
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media(max-width:768px){
    width: 100%;
  }
  @media(max-width:480px){
    width:-webkit-fill-available;
  }
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.span`
  font-size: 12px;
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

const Option = styled.option`
  font-size: 16px;
  color: #7a7a7a;
  background-color: #f4f6fc;
  font-weight: bold;
  padding: 10px 15px;
  border: 2px solid #001f3d;
  border-radius: 30px;
  
  &:hover {
    background-color: #001f3d;
    color: white;
  }
`;

const Input = styled.input`
  width: 87%;
  padding: 10px 20px;
  border: 1px solid #001f3d;
  border-radius: 5px;
  @media (max-width:480px){
    width: 75%;
  }
`;



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


const EditEnquiry = () => {
    const location = useLocation();
    const id = location.state.Id;
    const [selectedDuration, setSelectedDuration] = useState("");
    const [courses, setCourses] = useState([]);
    const [franchises, setFranchises] = useState([]);
    const [batchTimings, setBatchTimings] = useState([]);
    const [batches, setBatches] = useState([]);
    const [enquiryData, setEnquiryData] = useState({
        Name: '',
        FranchiseId: '',
        FranchiseName: '',
        Course: '',
        CourseId: '',
        MobileNo: '',
        AMobileNo: '',
        Qualification: '',
        KnowAbout: '',
        Address: '',
        PinCode: '',
        BatchTime: '',
        FeeMode: '',
        Hour: '',
        JoinDate: '',
        Remark: '',
        Status: 'Open'
    });

    useEffect(() => {
        const fetchFranchises = async () => {
            try {
                const response = await fetch("http://localhost:8000/franchise/all");
                const data = await response.json();
                setFranchises(data);
            } catch (error) {
                console.error("Error fetching franchises:", error);
            }
        };
        fetchFranchises();
    }, []);

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const response = await fetch("http://localhost:8000/batch/all");
                const data = await response.json();

                if (data && Array.isArray(data)) {
                    console.log(data)
                    // console.log(data); // Store fetched franchises in state
                    if (enquiryData.FranchiseId) {
                        var filData = data.find(item => item.FranchiseId === enquiryData.FranchiseId);
                        setBatches(filData);
                        console.log(filData)
                        if (enquiryData.FranchiseId) {
                            const filterSlot = filData?.Batch?.find((val) => val.Hour === enquiryData.Hour);
                            setBatchTimings(filterSlot ? filterSlot.Slots : []);
                        }
                    } else {
                        setBatches([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching franchises:", error);
            }
        };

        fetchBatch(); // Call the function to fetch franchises
    }, [franchises, enquiryData.FranchiseId]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (enquiryData.FranchiseId) {
                try {
                    const response = await fetch(`http://localhost:8000/course/all`);
                    const data = await response.json();
                    var franData = franchises.find(value => value.FranchiseID == enquiryData.FranchiseId);
                    var filterCourse = data.filter(value => value.FranchiseId == "All" || value.FranchiseId == enquiryData.FranchiseId || value.State == franData.State);
                    const coursesForFranchise = filterCourse || [];
                    setCourses(coursesForFranchise); // Set courses for selected franchise
                } catch (error) {
                    console.error("Error fetching courses:", error);
                }
            }
        };

        fetchCourses(); // Fetch courses when franchise changes
    }, [franchises, enquiryData.FranchiseId]);


    useEffect(() => {
        const fetchEnquiryData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/enquiry/get/${id}`);
                console.log(response.data); // Populate the form with the enquiry data
                setEnquiryData(response.data); // Populate the form with the enquiry data
            } catch (error) {
                console.error('Error fetching enquiry data:', error);
            }
        };
        fetchEnquiryData();
    }, [id, courses]);

    const handleFranchiseChange = (e) => {
        const { name, value } = e.target;
        const selectedFranchise = franchises.find(
            (franchise) => franchise.FranchiseName === value
        );
        setEnquiryData(prevData => ({
            ...prevData,
            [name]: value,
            FranchiseId: selectedFranchise ? selectedFranchise.FranchiseID : "",
        }));
    };

    const handleCourseChange = (e) => {
        const { value } = e.target;
        const selectedCourse = courses.find(course => course.CourseId === value);
        if (selectedCourse) {
            console.log("Selected Course:", selectedCourse); // Debug log
            setEnquiryData(prevData => ({
                ...prevData,
                Course: selectedCourse.CourseName
            }));
        }
    };



    const handleDurationChange = (e) => {
        const selectedDuration = e.target.value;
        setSelectedDuration(selectedDuration);

        // Update the enquiryData object to reflect the selected duration
        setEnquiryData((prevData) => ({
            ...prevData,
            Duration: selectedDuration // Set the selected hour in the enquiry data
        }));

        // Optionally, fetch batch timings based on the selected duration
        if (enquiryData.FranchiseId) {
            const filterSlot = batches?.Batch?.find((val) => val.Hour === selectedDuration);
            setBatchTimings(filterSlot ? filterSlot.Slots : []);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/enquiry/update/${id}`, enquiryData);
            alert(response.data.message);
        } catch (error) {
            alert('Failed to update enquiry.');
            console.error('Error updating enquiry:', error.response.data.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEnquiryData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <MainDashboard>

            <FormContainer>
                <Title>Edit Enquiry</Title>
                <Form onSubmit={handleSubmit}>
                    <Section>
                        <Heading>Details</Heading>
                    </Section>
                    <Main>
                        <InputContainer>
                            <Label>Name:</Label>
                            <Input
                                type="text"
                                name="Name"
                                value={enquiryData.Name}
                                onChange={handleChange}
                                placeholder='Enter Name'
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Franchise:</Label>
                            <Select1
                                name="FranchiseName"
                                value={enquiryData.FranchiseName}
                                onChange={handleFranchiseChange}
                            >
                                <option value="">Select a Franchise</option>
                                {franchises.map(franchise => (
                                    <option key={franchise.FranchiseID} value={franchise.FranchiseName}>
                                        {franchise.FranchiseName}
                                    </option>
                                ))}
                            </Select1>
                        </InputContainer>

                        <InputContainer>
                            <Label>Course:</Label>
                            <Select1
                                name="Course"
                                value={courses.find(course => course.CourseName === enquiryData.Course)?.CourseId || ""}  // Match the course name to CourseId
                                onChange={handleCourseChange}
                            >
                                <option value="">Select a Course</option>
                                {courses.length > 0 ? (
                                    courses.map(course => (
                                        <option key={course.CourseId} value={course.CourseId}>
                                            {course.CourseName}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No courses available</option>
                                )}
                            </Select1>


                        </InputContainer>

                        <InputContainer>
                            <Label>Mobile No:</Label>
                            <Input
                                type="text"
                                name="MobileNo"
                                value={enquiryData.MobileNo}
                                onChange={handleChange}
                                placeholder='Enter Mpbile No'
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Alternative Mobile No:</Label>
                            <Input
                                type="text"
                                name="AMobileNo"
                                value={enquiryData.AMobileNo}
                                onChange={handleChange}
                                placeholder='Enter Alternative Mobile No'
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Qualification:</Label>
                            <Input
                                type="text"
                                name="Qualification"
                                value={enquiryData.Qualification}
                                onChange={handleChange}
                                placeholder='Enter Qualification'
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>You came to know about ?</Label>
                            <Input
                                type="text"
                                name="KnowAbout"
                                value={enquiryData.KnowAbout}
                                onChange={handleChange}
                                placeholder='You came to know about ?'
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Address:</Label>
                            <Input
                                type="text"
                                name="Address"
                                value={enquiryData.Address}
                                onChange={handleChange}
                                placeholder='Enter Address'
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>PinCode:</Label>
                            <Input
                                type="text"
                                name="PinCode"
                                value={enquiryData.PinCode}
                                onChange={handleChange}
                                placeholder='Enter Pincode'
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label htmlFor="selectDuration" className="form-label">
                                Select Duration
                            </Label>
                            <Selects
                                className="form-control"
                                id="selectDuration"
                                name="selectDuration"
                                value={selectedDuration || enquiryData.Hour || ""}
                                onChange={handleDurationChange}
                                required
                            >
                                <option value="">Select Hour</option>

                                {/* Dynamically render batch hours */}
                                {batches?.Batch?.length > 0 ? (
                                    batches?.Batch?.map((batch) => (
                                        <option key={batch.Hour} value={batch.Hour}>
                                            {batch.Hour}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No Hour is Found</option> // Loading state
                                )}
                            </Selects>


                        </InputContainer>

                        <InputContainer>
                            <Label>Batch Time:</Label>
                            <Selects
                                name="BatchTime"
                                value={enquiryData.BatchTime}
                                onChange={handleChange}
                            >
                                <option value="">Select Slot</option>
                                {batchTimings.map((time, index) => (
                                    <option key={index} value={time.SlotTime}>
                                        {time.SlotTime}
                                    </option>
                                ))}
                            </Selects>
                        </InputContainer>

                        <InputContainer>
                            <Label>Join Date:</Label>
                            <Input
                                type="date"
                                name="JoinDate"
                                value={enquiryData.JoinDate}
                                onChange={handleChange}
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Remark:</Label>
                            <Input
                                type="text"
                                name="Remark"
                                value={enquiryData.Remark}
                                onChange={handleChange}
                                placeholder='Enter Remark'
                            />
                        </InputContainer>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                            <SubmitButton type="submit">
                                Submit
                            </SubmitButton>
                        </div>

                    </Main>
                </Form>
            </FormContainer>
        </MainDashboard>
    );
};

export default EditEnquiry;
