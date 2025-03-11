import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Select from "react-select";
import StateData from "./../../assets/State.json"
import { Form, FormContainer, Heading, Input, InputContainer, Label, Main, MainDashboard, Section, SubmitButton, Title } from "../Styles/GlobalStyles";


const SelectInput = styled(Select)`
   width: 100%;
  /* padding: 10px 20px; */
  border: 1px solid #001f3d;
  border-radius: 5px;
  font-size: 14px;
  @media (max-width: 480px) {
    height: 38px;
    width: 100%;
    font-size: 12px;
    padding: 0;
    /* margin: 1px; */
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


const Flex = styled.div`
display: flex;
align-items: center;
justify-content: center;
gap: 35px;
@media (max-width: 480px){
  flex-direction: column;
}
`;
const AddFranchise = () => {
  const [formData, setFormData] = useState({
    FranchiseName: "",
    OwnerName: "",
    Email: "",
    MobileNo: "",
    Address: "",
    UPIId: "",
    State: "",
    StateCode: "",
    City: "",
    Area: "",
    Pincode: "",
    HeadOffice: false,
    OpenTime: "",
    CloseTime: "",
    image: null, // For storing the file
  });
  const [stateData, setStateData] = useState([]);
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");


  // Fetch the JSON data from the assets folder
  useEffect(() => {
    // Convert the JSON object into an array of options for react-select
    const formattedData = Object.entries(StateData).map(([label, value]) => ({
      label: `${label}`, // Display state with code
      value: value,
    }));
    setStateData(formattedData);
    // console.log(formattedData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle checkbox (checked or unchecked)
      setFormData({
        ...formData,
        [name]: checked,  // Use 'checked' for checkboxes
      });
    } else {
      // Handle other input types (e.g., text inputs, selects)
      setFormData({
        ...formData,
        [name]: value,  // Use 'value' for other types
      });
    }
  };


  const handleStateChange = (selectedOption) => {
    console.log('Selected state:', selectedOption);
    setFormData({
      ...formData,
      State: selectedOption.label,
      StateCode: selectedOption.value
    });
    // console.log(formData)
  };

  const convertTo12HourFormat = (time24) => {
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours);
    const minute = minutes;

    // Determine AM or PM
    let period = hour >= 12 ? 'PM' : 'AM';

    // Convert hour from 24-hour format to 12-hour format
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'

    // Return formatted time
    console.log(`${hour}:${minute} ${period}`);
    return `${hour}:${minute} ${period}`;
  };

  // Handle the change in time input
  const handleOpenTimeChange = (e) => {
    const time = e.target.value;
    setOpen(time);
    setFormData({
      ...formData,
      OpenTime: convertTo12HourFormat(time)
    })
  };
  const handleCloseTimeChange = (e) => {
    const time = e.target.value;
    setClose(time)
    // If the input is valid, convert to 12-hour format
    setFormData({
      ...formData,
      CloseTime: convertTo12HourFormat(time)
    })
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0], // Store the file object
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = new FormData();
    // Append all the form fields to FormData
    Object.keys(formData).forEach((key) => {
      formToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "https://franchiseapi.kictindia.com/franchise/add",
        formToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // This is important for file uploads
          },
        }
      );
      alert("Franchise added successfully!");
      console.log(response.data);

      // Clear the form by resetting the formData state
      setFormData({
        FranchiseName: "",
        OwnerName: "",
        Email: "",
        MobileNo: "",
        Address: "",
        UPIId: "",
        State: "",
        StateCode: "",
        City: "",
        Area: "",
        Pincode: "",
        HeadOffice: false,
        OpenTime: "",
        CloseTime: "",
        image: null,
      });
    } catch (error) {
      console.error("Error adding franchise:", error);
      if ((error.response.data.message).includes("dup") && (error.response.data.message).includes("Email")) {
        alert("Email Data Already Exist!");
      } else {
        alert("Error adding franchise");
      }
    }
  };

  return (
    <MainDashboard>
      <FormContainer>
        <Title>Franchise Details</Title>
        <Form onSubmit={handleSubmit}>
          <Section>
            <Heading>Details</Heading>
          </Section>
          <Main>
            <InputContainer>
              <Label>Franchise Name</Label>
              <Input
                type="text"
                name="FranchiseName"
                placeholder="Enter Franchise Name"
                value={formData.FranchiseName}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Owner Name</Label>
              <Input
                type="text"
                name="OwnerName"
                placeholder="Enter Owner Name"
                value={formData.OwnerName}
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
            <InputContainer>
              <Label>State</Label>
              <SelectInput
                options={stateData}
                onChange={handleStateChange}
                placeholder="Select a State"
                isSearchable={true}
              />
            </InputContainer>
            <InputContainer>
              <Label>City</Label>
              <Input
                type="text"
                name="City"
                placeholder="Enter City"
                value={formData.City}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Area</Label>
              <Input
                type="text"
                name="Area"
                placeholder="Enter Area"
                value={formData.Area}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Pincode</Label>
              <Input
                type="text"
                name="Pincode"
                placeholder="Enter Pincode"
                value={formData.Pincode}
                onChange={handleInputChange}
              />
            </InputContainer>
          </Main>

          <Section>
            <Heading>UPI Details</Heading>
          </Section>
          <Main>
            <InputContainer>
              <Label>UPI Id</Label>
              <Input
                type="text"
                name="UPIId"
                placeholder="Enter UPI Id"
                value={formData.UPIId}
                onChange={handleInputChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>UPI Code</Label>
              <Input type="file" name="image" onChange={handleFileChange} />
            </InputContainer>
          </Main>

          <Section>
            <Heading>Other Details</Heading>
          </Section>
          <Flex>
            <InputContainer>
              <Label>Open Time</Label>
              <Input
                type="time"
                value={open}
                onChange={handleOpenTimeChange}
              />
            </InputContainer>
            <InputContainer>
              <Label>Close Time</Label>
              <Input
                type="time"
                value={close}
                onChange={handleCloseTimeChange}
              />
            </InputContainer>
          </Flex>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <SubmitButton type="submit">Submit</SubmitButton>
          </div>
        </Form>
      </FormContainer>
    </MainDashboard>
  );
};

export default AddFranchise;
