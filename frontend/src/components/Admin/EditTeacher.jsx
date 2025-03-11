import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-dropdown-select";
import axios from "axios";
import { Form, FormContainer, Heading, Input, InputContainer, Label, Main, MainDashboard, Select1, SubmitButton, Title } from "../Styles/GlobalStyles";

const EditTeacher = () => {
    const [franchises, setFranchises] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [myCourse, setMyCourse] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        TeacherID: '',
        Name: '',
        FranchiseId: '',
        FranchiseName: '',
        Image: '',
        Gender: '',
        DOB: '',
        DOJ: '',
        Email: '',
        MobileNo: '',
        Address: '',
        Salary: '',
        Role: []
    });
    const [files, setFiles] = useState({
        Image: null
    });

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch(`https://franchiseapi.kictindia.com/teacher/get/${location.state.Id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data)
                data.Role = (data.Role || '');
                setMyCourse(data.Role)
                setFormData(data);
            } catch (error) {
                console.error("Error fetching staff data:", error);
            }
        };
        fetchStaff();
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'date') {
            const [year, month, day] = value.split('-');
            setFormData(prevState => ({
                ...prevState,
                [name]: `${day}-${month}-${year}`
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));

        }
    };

    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target;
        setFiles((prevState) => ({
            ...prevState,
            [name]: fileList[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === 'object' && !Array.isArray(value)) {
                formDataToSubmit.append(key, JSON.stringify(value));
            } else if (Array.isArray(value)) {
                value.forEach((item) => formDataToSubmit.append(key, item));
            } else {
                formDataToSubmit.append(key, value);
            }
        });

        if (files.Image) {
            formDataToSubmit.append('Image', files.Image);
        }

        const staffId = location.state?.Id;
        if (!staffId) {
            console.error('Staff ID not provided.');
            return;
        }
        console.log("before submit", formDataToSubmit)
        try {
            const response = await axios.put(
                `https://franchiseapi.kictindia.com/teacher/update/${staffId}`,
                formDataToSubmit,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log("after put req", response)

            if (response.status === 200) {
                alert('Staff data updated successfully!');
                navigate(`/admin/allteacher`);
            }
        } catch (error) {
            console.error('Error updating staff data:', error);
        }
    };

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
                    console.log(courseOptions)
                    setCourses(courseOptions);
                }
            } catch (error) {
                console.error("Error fetching franchises:", error);
            }
        };

        fetchCourse();
    }, []);

    return (
        <MainDashboard>
            <FormContainer>
                <Title>Edit Teacher</Title>
                <Form onSubmit={handleSubmit}>
                    <Heading>Personal Information</Heading>
                    <Main>
                        <InputContainer>
                            <Label>Teacher ID</Label>
                            <Input
                                type="text"
                                name="TeacherID"
                                value={formData.TeacherID}
                                onChange={handleChange}
                                placeholder="Enter Teacher ID"
                                disabled
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                name="Name"
                                value={formData.Name}
                                onChange={handleChange}
                                placeholder="Enter teacher name"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>DOB</Label>
                            <Input
                                type="date"
                                name="DOB"
                                value={formData.DOB}
                                onChange={handleChange}
                                placeholder="Enter teacher DOB"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Date of Joining</Label>
                            <Input
                                type="date"
                                name="DOJ"
                                value={formData.DOJ}
                                onChange={handleChange}
                                placeholder="Enter teacher DOJ"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                placeholder="Enter teacher email"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="Salary"
                                value={formData.Salary}
                                onChange={handleChange}
                                placeholder="Enter teacher Salary"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Mobile No.</Label>
                            <Input
                                type="text"
                                name="MobileNo"
                                value={formData.MobileNo}
                                onChange={handleChange}
                                placeholder="Enter teacher mobile no."
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Address</Label>
                            <Input
                                type="text"
                                name="Address"
                                value={formData.Address}
                                onChange={handleChange}
                                placeholder="Enter teacher address"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Gender</Label>
                            <Select1
                                name="Gender"
                                value={formData.Gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Select1>
                        </InputContainer>

                        <InputContainer>
                        {console.log(myCourse)}
                            <Label>Course Name</Label>
                            <Select
                                name="CourseName"
                                options={courses}
                                 // Ensure it's an array for multiple selections
                                onChange={(selectedOptions) => setMyCourse(selectedOptions.map(cou => cou.value))} // Pass selected options to handler
                                multi
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Image</Label>
                            <Input
                                type="file"
                                name="Image"
                                onChange={handleFileChange}
                            />
                        </InputContainer>

                    </Main>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <SubmitButton type="submit">Update Teacher</SubmitButton>
                    </div>
                </Form>
            </FormContainer>
        </MainDashboard>
    );
};

export default EditTeacher;
