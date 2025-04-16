import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, FormContainer, Heading, Input, InputContainer, Label, Main, MainDashboard, SubmitButton, Title } from "../Styles/GlobalStyles";

const EditFranchise = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FranchiseID: '',
        FranchiseName: '',
        OwnerName: '',
        UPIId: '',
        UPICode: '', // Keep as a string for the image path (URL or filename)
        Email: '',
        MobileNo: '',
        Address: '',
        Date: '', // The Date field is for franchise registration date
    });
    const [files, setFiles] = useState({
        Image: null,
        UPICode: null // Handle the image for UPI code
    });

    useEffect(() => {
        const fetchFranchise = async () => {
            try {
                const response = await fetch(`http://localhost:8000/franchise/get/${location.state.FranchiseID}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error("Error fetching franchise data:", error);
            }
        };
        fetchFranchise();
    }, [location.state.FranchiseID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target;
        setFiles((prevState) => ({
            ...prevState,
            [name]: fileList[0]
        }));
    };

    const handleSubmit = async (e) => {
        console.log(formData)
        e.preventDefault();
    
        const formDataToSubmit = new FormData();
    
        // Append all fields from the formData
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSubmit.append(key, value);
        });
    
        // Append the UPI image if it's selected
        if (files.UPICode) {
            formDataToSubmit.append('UPICode', files.UPICode);
        }
    
        const franchiseId = location.state?.FranchiseID;
        if (!franchiseId) {
            console.error('Franchise ID not provided.');
            return;
        }
    
        try {
            const response = await axios.put(
                `http://localhost:8000/franchise/update/${franchiseId}`,
                formDataToSubmit,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
    
            if (response.status === 200) {
                alert('Franchise data updated successfully!');
                navigate(`/admin/allfranchise`);
            }
        } catch (error) {
            console.error('Error updating franchise data:', error);
        }
    };
    

    return (
        <MainDashboard>
            <FormContainer>
                <Title>Edit Franchise</Title>
                <Form onSubmit={handleSubmit}>
                    <Heading>Franchise Information</Heading>
                    <Main>
                        <InputContainer>
                            <Label>Franchise ID</Label>
                            <Input
                                type="text"
                                name="FranchiseID"
                                value={formData.FranchiseID}
                                onChange={handleChange}
                                placeholder="Enter Franchise ID"
                                disabled
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Franchise Name</Label>
                            <Input
                                type="text"
                                name="FranchiseName"
                                value={formData.FranchiseName}
                                onChange={handleChange}
                                placeholder="Enter Franchise Name"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Owner Name</Label>
                            <Input
                                type="text"
                                name="OwnerName"
                                value={formData.OwnerName}
                                onChange={handleChange}
                                placeholder="Enter Owner Name"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>UPI ID</Label>
                            <Input
                                type="text"
                                name="UPIId"
                                value={formData.UPIId}
                                onChange={handleChange}
                                placeholder="Enter UPI ID"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>UPI Code (Image)</Label>
                            <Input
                                type="file"
                                name="UPICode"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {formData.UPICode && (
                                <div style={{ marginTop: "10px" }}>
                                    <img 
                                        src={`http://localhost:8000/uploads/${formData.UPICode}`} 
                                        alt="UPI Code" 
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                                    />
                                </div>
                            )}
                        </InputContainer>

                        <InputContainer>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                placeholder="Enter Franchise Email"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Mobile No.</Label>
                            <Input
                                type="text"
                                name="MobileNo"
                                value={formData.MobileNo}
                                onChange={handleChange}
                                placeholder="Enter Mobile No."
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Address</Label>
                            <Input
                                type="text"
                                name="Address"
                                value={formData.Address}
                                onChange={handleChange}
                                placeholder="Enter Address"
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Registration Date</Label>
                            <Input
                                type="date"
                                name="Date"
                                value={formData.Date}
                                onChange={handleChange}
                                placeholder="Enter Registration Date"
                            />
                        </InputContainer>

                       
                    </Main>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <SubmitButton type="submit">Update Franchise</SubmitButton>
                    </div>
                </Form>
            </FormContainer>
        </MainDashboard>
    );
};


export default EditFranchise;
