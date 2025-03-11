// src/components/AddEnquiry.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from "styled-components";
import Select from "react-select";
import { SubmitButton, MainDashboard, Input, Main, Heading, Select1, Option, Label, InputContainer, FormContainer, Title, Form, Section } from '../Styles/GlobalStyles';

const AddEnquiry = () => {
    const [selectedDuration, setSelectedDuration] = useState("");
    const [courses, setCourses] = useState([]);
    const [franchises, setFranchises] = useState([]);
    const [allFranchises, setAllFranchises] = useState([]);
    const [batchTimings, setBatchTimings] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
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
    const [role, setRole] = useState("");

    useEffect(() => {
        var temp = localStorage.getItem("Role");
        setRole(temp);

        const fetchFranchises = async () => {
            try {
                const response = await fetch("https://franchiseapi.kictindia.com/franchise/all");
                const data = await response.json();

                if (Array.isArray(data)) {
                    setAllFranchises(data);

                    // If the role is "Franchise", automatically select the logged-in franchise
                    if (temp === "Franchise") {
                        var id = localStorage.getItem("Id"); // Get logged-in franchise ID

                        // Find the franchise in the fetched list based on the logged-in ID
                        var selectFran = data.find(val => val.FranchiseID === id);

                        if (selectFran) {
                            // Set the selected franchise to the state
                            setFranchises([selectFran]);

                            // Set the enquiry data with the franchise ID and name
                            setEnquiryData(prevData => ({
                                ...prevData,
                                FranchiseId: selectFran.FranchiseID,
                                FranchiseName: selectFran.FranchiseName
                            }));
                        }
                    } else {
                        // If role is not "Franchise", set all franchises
                        setFranchises(data);
                    }
                } else {
                    console.error("Franchise data is not an array:", data);
                }
            } catch (error) {
                console.error("Error fetching franchises:", error);
            }
        };

        fetchFranchises();
    }, []);



    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const response = await fetch("https://franchiseapi.kictindia.com/batch/all");
                const data = await response.json();

                if (data && Array.isArray(data)) {
                    console.log(data)
                    // console.log(data); // Store fetched franchises in state
                    if (enquiryData.FranchiseId) {
                        var filData = data.find(item => item.FranchiseId === enquiryData.FranchiseId);
                        setBatches(filData);
                        console.log(filData)
                    } else {
                        setBatches([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching franchises:", error);
            }
        };

        fetchBatch(); // Call the function to fetch franchises
    }, [enquiryData.FranchiseId]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (enquiryData.FranchiseId) {
                try {
                    const response = await fetch(`https://franchiseapi.kictindia.com/course/all`);
                    const data = await response.json();
                    var franData = allFranchises.find(value => value.FranchiseID == enquiryData.FranchiseId);
                    var filterCourse = data.filter(value => value.FranchiseId == "All" || value.FranchiseId == enquiryData.FranchiseId || value.State == franData.State);
                    const coursesForFranchise = filterCourse || [];
                    setCourses(coursesForFranchise); // Set courses for selected franchise
                } catch (error) {
                    console.error("Error fetching courses:", error);
                }
            }
        };

        fetchCourses(); // Fetch courses when franchise changes
    }, [enquiryData.FranchiseId]);

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
        const selectedCourse = courses.find(course => course.CourseName === value);
        setEnquiryData(prevData => ({
            ...prevData,
            Course: selectedCourse ? selectedCourse.CourseName : '',
            CourseId: selectedCourse ? selectedCourse.CourseId : '',
        }));
    };

    const handleDurationChange = (e) => {
        const selectedDuration = e.target.value;
        setEnquiryData(prevData => ({
            ...prevData,
            Hour: selectedDuration || '',
        }));
        setSelectedDuration(selectedDuration);
        if (enquiryData.FranchiseId) {
            var filterSlot = batches.Batch.find(val => val.Hour === e.target.value)
            console.log(filterSlot)
            setBatchTimings(filterSlot.Slots)
        }
        // let timings = [];
        // if (selectedDuration === "1hour") {
        //     timings = [
        //         "8 AM - 9 AM", "9 AM - 10 AM", "10 AM - 11 AM", "11 AM - 12 PM",
        //         "12 PM - 1 PM", "1 PM - 2 PM", "2 PM - 3 PM", "3 PM - 4 PM",
        //         "4 PM - 5 PM", "5 PM - 6 PM", "6 PM - 7 PM", "7 PM - 8 PM", "8 PM - 9 PM"
        //     ];
        // } else if (selectedDuration === "2hours") {
        //     timings = [
        //         "8 AM - 10 AM", "9 AM - 11 AM", "10 AM - 12 PM", "11 AM - 1 PM",
        //         "12 PM - 2 PM", "1 PM - 3 PM", "2 PM - 4 PM", "3 PM - 5 PM",
        //         "4 PM - 6 PM", "5 PM - 7 PM", "6 PM - 8 PM", "7 PM - 9 PM"
        //     ];
        // } else if (selectedDuration === "3hours") {
        //     timings = [
        //         "8 AM - 11 AM", "9 AM - 12 PM", "10 AM - 1 PM", "11 AM - 2 PM",
        //         "12 PM - 3 PM", "1 PM - 4 PM", "2 PM - 5 PM", "3 PM - 6 PM",
        //         "4 PM - 7 PM", "5 PM - 8 PM", "6 PM - 9 PM"
        //     ];
        // }
        // setBatchTimings(timings);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://franchiseapi.kictindia.com/enquiry/add', enquiryData);
            alert(response.data.message);
            setEnquiryData({
                Name: '',
                Course: '',
                CourseId: '',
                MobileNo: '',
                AMobileNo: '',
                Qualification: '',
                KnowAbout: '',
                Address: '',
                PinCode: '',
                Hour: '',
                BatchTime: '',
                FeeMode: '',
                JoinDate: '',
                Remark: '',
                Status: 'Open'
            });
        } catch (error) {
            alert('Failed to add enquiry.');
            console.error('Error adding enquiry:', error.response.data.message);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEnquiryData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    useEffect(() => {
        const today = new Date();
        // Format the date in YYYY-MM-DD format
        const formattedDate = today.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
    }, []);



    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    return (
        <MainDashboard>

            <FormContainer>
                <Title>Add New Enquiry</Title>
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

                        {/* {role == "Franchise" ? null : */}
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
                        {/*  } */}

                        <InputContainer>
                            <Label>Course:</Label>
                            <Select1
                                name="Course"
                                value={enquiryData.Course}
                                onChange={handleCourseChange}
                            >
                                <option value="">Select a Course</option>
                                {courses.length > 0 ? courses.map(course => (
                                    <option key={course.CourseName} value={course.CourseName}>
                                        {course.CourseName}
                                    </option>
                                )) : <option disabled>No courses available</option>}
                            </Select1>
                        </InputContainer>

                        <InputContainer>
                            <Label>Mobile No:</Label>
                            <Input
                                type="text"
                                name="MobileNo"
                                value={enquiryData.MobileNo}
                                onChange={handleChange}
                                placeholder='Enter Mobile No'
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
                            <Select1
                                className="form-control"
                                id="selectDuration"
                                name="selectDuration"
                                value={selectedDuration}
                                onChange={handleDurationChange}
                                required
                            >
                                <option value="">Select Hour</option>

                                {/* Dynamically render franchise options */}
                                {batches?.Batch?.length > 0 ? (
                                    batches?.Batch?.map((batch) => (
                                        <option key={batch.Hour} value={batch.Hour}>
                                            {batch.Hour}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No Hour is Found</option> // Loading state
                                )}
                            </Select1>
                        </InputContainer>

                        <InputContainer>
                            <Label>Batch Time:</Label>
                            <Select1
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
                            </Select1>
                        </InputContainer>
                        <InputContainer>
                            <Label>Fee Mode:</Label>
                            <Select1
                                name="FeeMode"
                                value={enquiryData.FeeMode}
                                onChange={handleChange}
                            >
                                <option value="">Select Fee Mode</option>
                                <option value="One Times">One Times</option>
                                <option value="Two Times">Two Times</option>
                                <option value="Three Times">Three Times</option>
                            </Select1>
                        </InputContainer>

                        <InputContainer>
                            <Label htmlFor="date">Join Date</Label>
                            <Input
                                type="date"
                                name="JoinDate"
                                id="date"
                                value={enquiryData.JoinDate}
                                onChange={handleChange}
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Remark</Label>
                            <Select1
                                name="Remark"
                                value={enquiryData.Remark}
                                onChange={handleChange}
                            >
                                <option value="">Select Remark</option>
                                <option value="Hot">Hot</option>
                                <option value="Open">Open</option>
                                <option value="Follow Up">Follow Up</option>
                            </Select1>
                            {/* <Input
                                type="text"
                                name="Remark"
                                value={enquiryData.Remark}
                                onChange={handleChange}
                                placeholder='Enter Remark'
                            /> */}
                        </InputContainer>

                    </Main>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <SubmitButton type="submit" className="btn btn-primary mt-3">
                            Submit
                        </SubmitButton>
                    </div>
                </Form>
            </FormContainer>
        </MainDashboard>
    );
};

export default AddEnquiry;
