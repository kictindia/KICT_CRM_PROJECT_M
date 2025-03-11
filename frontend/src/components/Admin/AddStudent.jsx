import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Select from "react-select"; // Assuming you're using react-select for dropdowns


const MainDashboard = styled.div`
  flex: 1;
  padding: 20px;
  width:  -webkit-fill-available;
  background-color: #f9f9f9;
`;
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
    content: "";
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

const Heading = styled.div`
  width: 30%;
  background: linear-gradient(270deg, #001f3d 0%, #0066cc 100%);
  color: white;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin-bottom: 40px;
  font-size: 16px;
  @media (max-width: 480px) {
    width: 49%;
  }
`;

const Section = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const Main1 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 30px 0px;
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  /* border-radius: 10px; */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.span`
  position: absolute;
  top: -10px;
  left: 20px;
  /* background: linear-gradient(
    193deg,
    #001f3d 4.05%,
    #0066cc 28.84%,
    #fff 120.07%
    
  ); */
  background: linear-gradient(270deg, #001f3d 0%, #0066cc 100%);
  color: white;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  /* z-index: 1; */
`;

const Separate = styled.div`
  display: flex;
`;

const SelectInput = styled(Select)`
  width: 104%;
  padding: 5px 20px;
  border: 2px solid #001f3d;
  border-radius: 30px;
  font-size: 16px;
  color: #7a7a7a;
  background-color: #f4f6fc;
  font-weight: bold;
  outline: none;
  /* display: inline-block; */
  margin-right: 10px; /* Space between select and input */

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
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SelectInput2 = styled(Select)`
  width: 50%;
  padding: 5px 20px;
  border: 2px solid #001f3d;
  border-radius: 30px;
  font-size: 16px;
  color: #7a7a7a;
  background-color: #f4f6fc;
  font-weight: bold;
  outline: none;
  margin-right: 10px; /* Space between select and input */

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

const Selects = styled.select`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #001f3d;
  border-radius: 30px;
  font-size: 16px;
  color: #7a7a7a;
  background-color: #f4f6fc;
  font-weight: bold;
  outline: none;
`;

const Input = styled.input`
  width: 90%;
  padding: 15px 20px;
  border: 2px solid #001f3d;
  border-radius: 30px;
  font-size: 16px;
  color: #7a7a7a;
  background-color: #f4f6fc;
  font-weight: bold;
  outline: none;
`;

const SubmitButton = styled.button`
  width: 320px;
  padding: 12px;
  background: linear-gradient(
    193deg,
    #001f3d 4.05%,
    #0066cc 28.84%,
    #fff 120.07%
  );
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
  margin-top: 20px;

  &:hover {
    background: linear-gradient(
      193deg,
      #59161e 4.05%,
      #0066cc 28.84%,
      #001f3d 120.07%
    );
  }
`;

const StudentRegistrationForm = () => {
  const [courses, setCourses] = useState([]);
  const [countries, setCountries] = useState({ withCode: [], withoutCode: [] });
  const [studentCountryCode, setStudentCountryCode] = useState("");
  const [altStudentCountryCode, setAltStudentCountryCode] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [batchTimings, setBatchTimings] = useState([]);
  const generateTemporaryRegistrationNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return "TEMP-" + randomNum;
  };
  const [formData, setFormData] = useState({
    registrationNumber: generateTemporaryRegistrationNumber(),
    aadhaarNumber: "",
    admissionDate: "",
    studentName: "",
    studentPhoto: null,
    birthDate: "",
    sex: "",
    religion: "",
    studentMobile: "",
    studentAltMobile: "",
    presentAddress: "",
    country: null,
    state: "",
    pincode: "",
    area: "",
    qualification: "",
    firstGuardianName: "",
    firstGuardianMobile: "",
    firstGuardianOccupation: "",
    secondGuardianName: "",
    secondGuardianMobile: "",
    secondGuardianOccupation: "",
    selectCourse: "",
    duration: "",
    batchTiming: "",
  });

  useEffect(() => {
    // Fetch courses from Google Sheets
    const sheetID = "1rR-hcfFWTlST-IcWK4kvBDgM5XKJNvjgo-n5NyW2FdE";
    const sheetName = "Course List";
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    axios
      .get(url)
      .then((response) => {
        const data = JSON.parse(response.data.substr(47).slice(0, -2));
        setCourses(data.table.rows.map((row) => row.c[0].v));
      })
      .catch((error) => console.error("Error fetching course data:", error));

    // Fetch countries and country codes
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        // For mobile number (country code + country name)
        const countryOptionsWithCode = response.data.map((country) => ({
          label: `${country.name.common} (${country.idd?.root || ""}${
            country.idd?.suffixes?.[0] || ""
          })`,
          value: `${country.idd?.root || ""}${
            country.idd?.suffixes?.[0] || ""
          }`,
        }));

        // For address (only country name)
        const countryOptionsWithoutCode = response.data.map((country) => ({
          label: country.name.common,
          value: country.name.common,
        }));

        setCountries({
          withCode: countryOptionsWithCode,
          withoutCode: countryOptionsWithoutCode,
        });
      })
      .catch((error) => console.error("Error fetching countries:", error));

    // Set default date to today's date in dd/mm/yyyy format
    const today = new Date();
    const formattedDate =
      String(today.getDate()).padStart(2, "0") +
      "/" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "/" +
      today.getFullYear();
    setFormData((prevData) => ({ ...prevData, admissionDate: formattedDate }));
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleMobileSelectChange = (selectedOption) => {
    setStudentCountryCode(selectedOption.value);
    setFormData((prev) => ({
      ...prev,
      studentMobile: `${selectedOption.value}${prev.studentMobile.slice(
        selectedOption.value.length
      )}`,
    }));
  };

  const handleAltMobileSelectChange = (selectedOption) => {
    setAltStudentCountryCode(selectedOption.value);
    setFormData((prev) => ({
      ...prev,
      studentAltMobile: `${selectedOption.value}${prev.studentAltMobile.slice(
        selectedOption.value.length
      )}`,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  // Generate temporary registration number

  // Handle duration change to update batch timings
  const handleDurationChange = (e) => {
    const selectedDuration = e.target.value;
    setSelectedDuration(selectedDuration);
    let timings = [];
    if (selectedDuration === "1hour") {
      timings = [
        "8 AM - 9 AM",
        "9 AM - 10 AM",
        "10 AM - 11 AM",
        "11 AM - 12 PM",
        "12 PM - 1 PM",
        "1 PM - 2 PM",
        "2 PM - 3 PM",
        "3 PM - 4 PM",
        "4 PM - 5 PM",
        "5 PM - 6 PM",
        "6 PM - 7 PM",
        "7 PM - 8 PM",
        "8 PM - 9 PM",
      ];
    } else if (selectedDuration === "2hours") {
      timings = [
        "8 AM - 10 AM",
        "9 AM - 11 AM",
        "10 AM - 12 PM",
        "11 AM - 1 PM",
        "12 PM - 2 PM",
        "1 PM - 3 PM",
        "2 PM - 4 PM",
        "3 PM - 5 PM",
        "4 PM - 6 PM",
        "5 PM - 7 PM",
        "6 PM - 8 PM",
        "7 PM - 9 PM",
      ];
    } else if (selectedDuration === "3hours") {
      timings = [
        "8 AM - 11 AM",
        "9 AM - 12 PM",
        "10 AM - 1 PM",
        "11 AM - 2 PM",
        "12 PM - 3 PM",
        "1 PM - 4 PM",
        "2 PM - 5 PM",
        "3 PM - 6 PM",
        "4 PM - 7 PM",
        "5 PM - 8 PM",
        "6 PM - 9 PM",
      ];
    }
    setBatchTimings(timings);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", {
      selectedCourse,
      selectedDuration,
      batchTimings,
    });
  };

  return (
    <MainDashboard>
    <FormContainer>
      <Title>Student Registration Form</Title>
      <Form onSubmit={handleSubmit}>
        <Section>
          <Heading>Details</Heading>
        </Section>
        <Main>
          <InputContainer>
            <Label htmlFor="registrationNumber" className="form-label">
              Registration Number
            </Label>
            <Input
              type="text"
              className="form-control"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              readOnly
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="aadhaarNumber" className="form-label">
              Aadhaar Number
            </Label>
            <Input
              type="text"
              className="form-control"
              id="aadhaarNumber"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleInputChange}
              placeholder="Enter Aadhaar Number"
              required
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="admissionDate" className="form-label">
              Date of Admission
            </Label>
            <Input
              type="text"
              className="form-control"
              id="admissionDate"
              name="admissionDate"
              value={formData.admissionDate}
              readOnly
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="branchSelect" className="form-label">
              Select Branch
            </Label>
            <Selects
              className="form-control"
              id="branchSelect"
              name="branchSelect"
              onChange={handleInputChange}
              required
            >
              <option value="" disabled selected>
                Select a branch
              </option>
              <option value="branch1">Headoffice - Ghatlodhiya</option>
              <option value="branch2">South Bopal</option>
              <option value="branch3">Gota</option>
              <option value="branch4">Maninager</option>
            </Selects>
          </InputContainer>
        </Main>
        <Section>
          <Heading>Personal Information</Heading>
        </Section>
        <Main>
          <InputContainer>
            <Label htmlFor="studentName" className="form-label">
              Student Full Name
            </Label>
            <Input
              type="text"
              className="form-control"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="studentPhoto" className="form-label">
              Student Photo
            </Label>
            <Input
              type="file"
              className="form-control"
              id="studentPhoto"
              name="studentPhoto"
              onChange={handleFileChange}
              required
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="birthDate" className="form-label">
              Birth Date
            </Label>
            <Input
              type="date"
              className="form-control"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="religion" className="form-label">
              Religion
            </Label>
            <Input
              type="text"
              className="form-control"
              id="religion"
              name="religion"
              value={formData.religion}
              onChange={handleInputChange}
              placeholder="Enter Religion"
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="sex" className="form-label">
              Sex
            </Label>
            <RadioGroup>
              <div className="form-check form-check-inline">
                <RadioButton
                  className="form-check-input"
                  type="radio"
                  name="sex"
                  id="male"
                  value="Male"
                  checked={formData.sex === "Male"}
                  onChange={handleInputChange}
                  required
                />
                <RadioLabel className="form-check-label" htmlFor="male">
                  Male
                </RadioLabel>
              </div>
              <div className="form-check form-check-inline">
                <RadioButton
                  className="form-check-input"
                  type="radio"
                  name="sex"
                  id="female"
                  value="Female"
                  checked={formData.sex === "Female"}
                  onChange={handleInputChange}
                />
                <RadioLabel className="form-check-label" htmlFor="female">
                  Female
                </RadioLabel>
              </div>
              <div className="form-check form-check-inline">
                <RadioButton
                  className="form-check-input"
                  type="radio"
                  name="sex"
                  id="other"
                  value="Other"
                  checked={formData.sex === "Other"}
                  onChange={handleInputChange}
                />
                <RadioLabel className="form-check-label" htmlFor="other">
                  Other
                </RadioLabel>
              </div>
            </RadioGroup>
          </InputContainer>
        </Main>
        <Main1>
          <InputContainer>
            <Label htmlFor="studentMobile" className="form-label">
              Mobile Number
            </Label>
            <Separate>
              <SelectInput2
                options={countries.withCode} // Use the country options with country code here
                value={countries.withCode.find(
                  (country) => country.value === studentCountryCode
                )}
                onChange={handleMobileSelectChange}
                placeholder="Select Country"
                required
              />
              <Input
                type="text"
                className="form-control"
                id="studentMobile"
                name="studentMobile"
                value={formData.studentMobile}
                onChange={handleInputChange}
                placeholder="Enter Mobile Number"
                required
              />
            </Separate>
          </InputContainer>
          <InputContainer>
            <Label htmlFor="studentAltMobile" className="form-label">
              Alternate Mobile Number
            </Label>
            <Separate>
              <SelectInput2
                options={countries.withCode} // Use the country options with country code here
                value={countries.withCode.find(
                  (country) => country.value === altStudentCountryCode
                )}
                onChange={handleAltMobileSelectChange}
                placeholder="Select Country"
              />
              <Input
                type="text"
                className="form-control"
                id="studentAltMobile"
                name="studentAltMobile"
                value={formData.studentAltMobile}
                onChange={handleInputChange}
                placeholder="Enter Alternate Mobile"
              />
            </Separate>
          </InputContainer>
        </Main1>
        <Main>
          <InputContainer>
            <Label htmlFor="presentAddress" className="form-label">
              Present Address
            </Label>
            <Input
              type="text"
              className="form-control"
              id="presentAddress"
              name="presentAddress"
              value={formData.presentAddress}
              onChange={handleInputChange}
              placeholder="Enter Present Address"
              required
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="country" className="form-label">
              Country
            </Label>
            <SelectInput
              options={countries.withoutCode} // Use the country options without country code here
              value={countries.withoutCode.find(
                (country) => country.value === formData.country
              )}
              onChange={(selectedOption) =>
                setFormData({ ...formData, country: selectedOption.value })
              }
              placeholder="Select Country"
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="state" className="form-label">
              State
            </Label>
            <Input
              type="text"
              className="form-control"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter State"
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="pincode" className="form-label">
              Pincode
            </Label>
            <Input
              type="text"
              className="form-control"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              placeholder="Enter Pincode"
              required
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="area" className="form-label">
              Area
            </Label>
            <Input
              type="text"
              className="form-control"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Enter Area"
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="qualification" className="form-label">
              Qualification
            </Label>
            <Input
              type="text"
              className="form-control"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              placeholder="Enter Qualification"
              required
            />
          </InputContainer>
        </Main>
        {/* Guardian Details Section */}
        <Section>
          <Heading>Guardian Details</Heading>
        </Section>
        <Main>
          <InputContainer>
            <Label htmlFor="firstGuardianName" className="form-label">
              First Guardian's Name (Mr./Mrs./Miss)
            </Label>
            <Input
              type="text"
              className="form-control"
              id="firstGuardianName"
              name="firstGuardianName"
              value={formData.firstGuardianName}
              onChange={handleInputChange}
              placeholder="Enter First Guardian's Name"
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="firstGuardianMobile" className="form-label">
              First Guardian's Mobile Number
            </Label>
            <Input
              type="text"
              className="form-control"
              id="firstGuardianMobile"
              name="firstGuardianMobile"
              value={formData.firstGuardianMobile}
              onChange={handleInputChange}
              placeholder="Enter First Guardian's Mobile Number"
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="firstGuardianOccupation" className="form-label">
              First Guardian's Occupation
            </Label>
            <Input
              type="text"
              className="form-control"
              id="firstGuardianOccupation"
              name="firstGuardianOccupation"
              value={formData.firstGuardianOccupation}
              onChange={handleInputChange}
              placeholder="Enter First Guardian's Occupation"
              required
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="secondGuardianName" className="form-label">
              Second Guardian's Name (Mr./Mrs./Miss)
            </Label>
            <Input
              type="text"
              className="form-control"
              id="secondGuardianName"
              name="secondGuardianName"
              value={formData.secondGuardianName}
              onChange={handleInputChange}
              placeholder="Enter Second Guardian's Name"
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="secondGuardianMobile" className="form-label">
              Second Guardian's Mobile Number
            </Label>
            <Input
              type="text"
              className="form-control"
              id="secondGuardianMobile"
              name="secondGuardianMobile"
              value={formData.secondGuardianMobile}
              onChange={handleInputChange}
              placeholder="Enter Second Guardian's Mobile Number"
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="secondGuardianOccupation" className="form-label">
              Second Guardian's Occupation
            </Label>
            <Input
              type="text"
              className="form-control"
              id="secondGuardianOccupation"
              name="secondGuardianOccupation"
              value={formData.secondGuardianOccupation}
              onChange={handleInputChange}
              placeholder="Enter Second Guardian's Occupation"
            />
          </InputContainer>
        </Main>

        <Section>
          <Heading>Course</Heading>
        </Section>
        <Main>
          <InputContainer>
            <Label htmlFor="selectCourse" className="form-label">
              Select Course
            </Label>
            <SelectInput
              id="selectCourse"
              options={courses.map((course) => ({
                label: course,
                value: course,
              }))}
              value={
                selectedCourse
                  ? { label: selectedCourse, value: selectedCourse }
                  : null
              }
              onChange={(selectedOption) =>
                setSelectedCourse(selectedOption.value)
              }
              placeholder="Select Course"
              required
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
              value={selectedDuration}
              onChange={handleDurationChange}
              required
            >
              <option value="" disabled>
                Select Duration
              </option>
              <option value="1hour">1 Hour</option>
              <option value="2hours">2 Hours</option>
              <option value="3hours">3 Hours</option>
            </Selects>
          </InputContainer>
          <InputContainer>
            <Label htmlFor="selectBatchTiming" className="form-label">
              Select Batch Timing
            </Label>
            <Selects
              className="form-control"
              id="selectBatchTiming"
              name="selectBatchTiming"
              required
            >
              <option value="" disabled>
                Select Batch Timing
              </option>
              {batchTimings.map((timing, index) => (
                <option key={index} value={timing}>
                  {timing}
                </option>
              ))}
            </Selects>
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

export default StudentRegistrationForm;
