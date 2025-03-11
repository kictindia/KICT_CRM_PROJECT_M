import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Select from "react-select";
import countries from "./../../assets/MobileCode.json";

// Styled-components for styling the form
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

const Heading = styled.div`
  width: 30%;
  background: #ffffff; /* White background for simplicity */
  color: #000000; /* Dark grey text */
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin-bottom: 40px;
  font-size: 18px;
  font-weight: 700; /* Slightly bolder text for readability */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  border: 2px solid #0066cc; /* Blue border for subtle highlight */
  transition: all 0.3s ease; /* Smooth transition on hover */

  &:hover {
    background: #f4f8ff; /* Light blue background on hover */
    color: #0066cc; /* Change text to blue on hover */
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2); /* Stronger shadow on hover */
    border-color: #004a99; /* Darker blue border on hover */
  }

  @media (max-width: 480px) {
    width: 100%; /* Full width on smaller screens */
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
    display: flex;
    flex-direction: column;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
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

const SelectInput2 = styled(Select)`
  width: 100%;
  border: 1px solid #001f3d;
  border-radius: 5px;
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

const MainDashboard = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding: 20px;
  width: -webkit-fill-available;
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

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    width: 80%;
  }
`;

const Input = styled.input`
  width: 87%;
  padding: 10px 20px;
  border: 1px solid #001f3d;
  border-radius: 5px;
  @media (max-width: 480px) {
    width: 75%;
  }
`;

const SubmitButton = styled.button`
  width: 320px;
  padding: 12px;
  background: #12192c; /* Initial background */
  color: white; /* Initial text color */
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  transition: all 0.3s ease; /* Smooth transition for all changes */
  margin-top: 20px;

  &:hover {
    background: white; /* Background turns white on hover */
    color: #12192c; /* Text turns dark blue */
    border: 2px solid #12192c; /* Adds dark blue border on hover */
    animation: bounce 0.5s ease-out; /* Bounce effect on hover */
  }

  @media (max-width: 480px) {
    width: 80%; /* Button width adjustment for small screens */
  }

  /* Keyframes for bounce animation */
  @keyframes bounce {
    0% {
      transform: translateY(0); /* Starting position */
    }
    30% {
      transform: translateY(-5px); /* Move up */
    }
    50% {
      transform: translateY(0); /* Back to normal position */
    }
    70% {
      transform: translateY(-2px); /* Move up slightly */
    }
    100% {
      transform: translateY(0); /* Final position */
    }
  }
`;

const Label = styled.span`
  font-size: 12px;
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

const RemoveButton = styled.button`
  width: 200px;
  padding: 12px;
  background: #d32f2f; /* Initial background: red */
  color: white; /* Initial text color */
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  transition: all 0.3s ease; /* Smooth transition for all changes */
  margin-top: 20px;

  &:hover {
    background: white; /* Background turns white on hover */
    color: #d32f2f; /* Text turns red */
    border: 2px solid #d32f2f; /* Adds red border on hover */
    animation: bounce 0.5s ease-out; /* Bounce effect on hover */
  }

  @media (max-width: 480px) {
    width: 80%; /* Button width adjustment for small screens */
  }

  /* Keyframes for bounce animation */
  @keyframes bounce {
    0% {
      transform: translateY(0); /* Starting position */
    }
    30% {
      transform: translateY(-5px); /* Move up */
    }
    50% {
      transform: translateY(0); /* Back to normal position */
    }
    70% {
      transform: translateY(-2px); /* Move up slightly */
    }
    100% {
      transform: translateY(0); /* Final position */
    }
  }
`;

const AdmissionForm = () => {
  const generateTemporaryRegistrationNumber = async () => {
    const response = await fetch(`https://franchiseapi.kictindia.com/student/id`);
    const data = await response.json();
    console.log(data.Count + 1)
    return data.Count;
    // const randomNum = Math.floor(100000 + Math.random() * 900000);
    // return "KICT-" + randomNum;
  };
  const [formData, setFormData] = useState({
    RegistrationNumber: generateTemporaryRegistrationNumber(),
    AadhaarNumber: "",
    DateofAdmission: "",
    Branch: "",
    FranchiseId: "",
    Name: "",
    Gender: "",
    DOB: "",
    MobileNo: "",
    AlterMobileNo: "",
    Email: "",
    Address: "",
    Country: "",
    State: "",
    Pincode: "",
    Area: "",
    Discount: 0,
    AdditionalCharge: 0,
    Qualification: "",
    GuardianDetails: [{ GName: "", GMobileNo: "", GOccupation: "" }],
    Course: [
      {
        CourseId: "",
        CourseName: "",
        CourseDuration: "",
        FeeMode: "",
        Fee: "",
        Hour: "",
        Slot: "",
        Discount: 0,
        Additional: 0,
      },
    ],
  });
  const [franchises, setFranchises] = useState([]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [altPhoneCode, setAltPhoneCode] = useState("");
  const [allFranchises, setAllFranchises] = useState([]);
  const [courses, setCourses] = useState("");
  const [feeMode, setFeeMode] = useState([{}]);
  const [batches, setBatches] = useState([]);
  const [slots, setSlots] = useState([]);
  const [defaultSlot, setDefaultSlot] = useState([]);

  const countryOptions = countries.map((country) => ({
    value: country.dial_code,
    label: `${country.name} (${country.dial_code})`,
  }));

  const countryName = countries.map((country) => ({
    value: country.name,
    label: country.name,
  }));

  useEffect(() => {
    generateTemporaryRegistrationNumber
    var temp = localStorage.getItem("Role");

    const fetchFranchises = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/franchise/all");
        const data = await response.json();
        setAllFranchises(data);
        if (temp == "Franchise") {
          var id = localStorage.getItem("Id");
          var selectFran = data.find((val) => val.FranchiseID == id);
          setFranchises([selectFran]);
          setFormData((prev) => ({
            ...prev,
            FranchiseId: selectFran.FranchiseID,
            Branch: selectFran.FranchiseName,
          }));
        } else if (temp == "Teacher") {
          var id = JSON.parse(localStorage.getItem("TeacherData"));
          console.log(id);
          var selectFran = data.find(
            (val) => val.FranchiseID == id.FranchiseId
          );
          setFranchises([selectFran]);
          setFormData((prev) => ({
            ...prev,
            FranchiseId: selectFran.FranchiseID,
            Branch: selectFran.FranchiseName,
          }));
        } else {
          setFranchises(data);
        }
      } catch (error) {
        console.error("Error fetching franchises:", error);
      }
    };
    fetchFranchises();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`https://franchiseapi.kictindia.com/course/all`);
        const data = await response.json();
        var franData = allFranchises.find(
          (value) => value.FranchiseID == formData.FranchiseId
        );
        var filterCourse = data.filter(
          (value) =>
            value.FranchiseId == "All" ||
            value.FranchiseId == formData.FranchiseId ||
            value.State == franData.State
        );
        const coursesForFranchise = filterCourse || [];
        setCourses(coursesForFranchise);
        // console.log(data)
      } catch (error) {
        console.error("Error fetching franchises:", error);
      }
    };

    if (formData.FranchiseId) {
      fetchCourse();
    }
  }, [formData.FranchiseId]);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/batch/all");
        const data = await response.json();

        if (data && Array.isArray(data)) {
          console.log(data.FranchiseId);
          console.log(formData.FranchiseId);
          // console.log(data); // Store fetched franchises in state
          if (formData.FranchiseId) {
            var franData = data.map((value) => console.log(value));
            var filData = data.find(
              (item) => item.FranchiseId === formData.FranchiseId
            );
            setBatches(filData);
            console.log(filData);
            setDefaultSlot(filData.Batch);
          } else {
            setBatches([]);
          }
        }
      } catch (error) {
        console.error("Error fetching franchises:", error);
      }
    };

    fetchBatch(); // Call the function to fetch franchises
  }, [formData.FranchiseId]);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handelCountryCodeChange = (value) => {
    setPhoneCode(value.value);
  };
  const handelCountryCodeChange1 = (value) => {
    setAltPhoneCode(value.value);
  };
  const handelCountryChange = (value) => {
    setFormData({
      ...formData,
      Country: value.value,
    });
  };
  // Handle file input
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle adding a new Guardian
  const addGuardian = () => {
    setFormData({
      ...formData,
      GuardianDetails: [
        ...formData.GuardianDetails,
        { GName: "", GMobileNo: "", GOccupation: "" },
      ],
    });
  };

  // Handle adding a new Course
  const addCourse = () => {
    setFormData({
      ...formData,
      Course: [
        ...formData.Course,
        {
          CourseId: "",
          CourseName: "",
          CourseDuration: "",
          FeeMode: "",
          Fee: "",
          Hour: "",
          Slot: "",
          Discount: 0,
          Additional: 0,
        },
      ],
    });
    setFeeMode([...feeMode, {}]);
  };

  // Handle changes in Guardian Details input fields
  const handleGuardianChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGuardians = formData.GuardianDetails.map((guardian, idx) =>
      idx === index ? { ...guardian, [name]: value } : guardian
    );
    setFormData({ ...formData, GuardianDetails: updatedGuardians });
  };

  // Handle changes in Course input fields
  const handleCourseChange = (index, e) => {
    const { name, value } = e.target;
    // console.log(index);
    var filData = courses.find((val) => val.CourseId === value);
    console.log(filData);
    const updatedCourses = formData.Course.map((course, idx) =>
      idx === index
        ? {
          ...course,
          CourseId: value,
          CourseName: filData.CourseName,
          CourseDuration: filData.CourseDuration,
          Hour: "",
          Fee: "",
          FeeMode: "",
          Slot: "",
        }
        : course
    );
    feeMode.map((val, idx) => {
      // console.log(index, idx)
      if (idx === index) {
        feeMode[idx] = filData.Price;
      }
    });

    console.log(updatedCourses);
    setFormData({ ...formData, Course: updatedCourses });
  };

  const handleCourseFeeModeChange = (index, e) => {
    const updatedCourses = [...formData.Course];
    updatedCourses[index].FeeMode = e.target.value;
    console.log(e.target.value);
    var fe = feeMode[index].Plans.find(
      (val) => val.PlanName === e.target.value
    );
    console.log(fe.TotalFee);
    if (fe.TotalFee === 0) {
      alert("Contact Franchise, Something Went Wrong");
      updatedCourses[index].FeeMode = "";
      return;
    }
    updatedCourses[index].Fee = fe.TotalFee;
    setFormData({ ...formData, Course: updatedCourses });
  };

  const handelHourChange = (index, e) => {
    const updatedCourses = [...formData.Course];
    updatedCourses[index].Hour = e.target.value;
    if (formData.FranchiseId) {
      var filterSlot = batches.Batch.find((val) => val.Hour === e.target.value);
      console.log(filterSlot);
      setSlots(filterSlot.Slots);
    }
    setFormData({ ...formData, Course: updatedCourses });
  };

  const handelSlotChange = (index, e) => {
    const updatedCourses = [...formData.Course];
    updatedCourses[index].Slot = e.target.value;
    setFormData({ ...formData, Course: updatedCourses });
  };
  const handelDiscountChange = (index, e) => {
    const updatedCourses = [...formData.Course];
    updatedCourses[index].Discount = e.target.value;
    setFormData({ ...formData, Course: updatedCourses });
  };
  const handelAdditionChange = (index, e) => {
    const updatedCourses = [...formData.Course];
    updatedCourses[index].Additional = e.target.value;
    setFormData({ ...formData, Course: updatedCourses });
  };

  // Handle removing a Guardian
  const removeGuardian = (index) => {
    const updatedGuardians = formData.GuardianDetails.filter(
      (_, idx) => idx !== index
    );
    setFormData({ ...formData, GuardianDetails: updatedGuardians });
  };

  // Handle removing a Course
  const removeCourse = (index) => {
    const updatedCourses = formData.Course.filter((_, idx) => idx !== index);
    setFormData({ ...formData, Course: updatedCourses });
  };

  const handleFranchiseChange = (e) => {
    const selectedFranchise = franchises.find(
      (franchise) => franchise.FranchiseName === e.target.value
    );
    setFormData({
      ...formData,
      Branch: e.target.value,
      FranchiseId: selectedFranchise ? selectedFranchise.FranchiseID : "",
      Course: [
        {
          CourseId: "",
          CourseName: "",
          CourseDuration: "",
          FeeMode: "",
          Fee: "",
          Hour: "",
          Slot: "",
          Discount: 0,
          Additional: 0,
        },
      ],
    });
    setFeeMode([{}]);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);

    const data = new FormData();
    data.append("image", image);
    for (const key in formData) {
      console.log(typeof formData[key] == "object");
      if (key === "MobileNo") {
        data.append(key, phoneCode + " " + formData[key]); // Convert arrays to strings for submission
      } else if (key === "AlterMobileNo") {
        data.append(key, altPhoneCode + " " + formData[key]); // Convert arrays to strings for submission
      } else {
        if (typeof formData[key] == "object") {
          data.append(key, JSON.stringify(formData[key])); // Convert arrays to strings for submission
        } else {
          data.append(key, formData[key]);
        }
      }
    }
    console.log(formData);
    try {
      const response = await axios.post(
        "https://franchiseapi.kictindia.com/pending-student/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      alert("Student added successfully!");

      // // Fetch the role from localStorage
      const role = localStorage.getItem("Role"); // Assuming 'role' is saved in localStorage

      // Redirect based on role
      if (role === "Admin") {
        window.location.href = "/admin/allstudent";
      } else if (role === "Franchise") {
        window.location.href = "/branch/allstudent";
      } else if (role === "Teacher") {
        window.location.href = "/teacher/allstudent";
      } else {
        // Default case if the role is not found
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError("Error adding student");
    }
  };

  function getSlotsByHour(hour) {
    const found = defaultSlot.find((item) => item.Hour === hour);
    return found ? found.Slots : [];
  }

  return (
    <MainDashboard>
      <FormContainer>
        <Title>Add Student</Title>
        <Form onSubmit={handleSubmit}>
          <Section>
            <Heading>Details</Heading>
          </Section>
          <Main>
            <InputContainer>
              <Label>Registration Number</Label>
              <Input
                type="text"
                name="RegistrationNumber"
                placeholder="Registration Number"
                value={formData.RegistrationNumber}
                onChange={handleChange}
                required
                readOnly
              />
            </InputContainer>
            <InputContainer>
              <Label>Aadhar Number</Label>
              <Input
                type="text"
                name="AadhaarNumber"
                placeholder="Aadhaar Number"
                value={formData.AadhaarNumber}
                onChange={handleChange}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label>Date of Admission</Label>
              <Input
                type="date"
                name="DateofAdmission"
                value={formData.DateofAdmission}
                onChange={handleChange}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label>Franchise</Label>
              <Select1
                name="Branch"
                value={formData.Branch}
                onChange={handleFranchiseChange} // Use the handleFranchiseChange here
              >
                <option value="">Select Branch</option>

                {/* Dynamically render franchise options */}
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
                  <option disabled>Loading franchises...</option> // Loading state
                )}
              </Select1>
            </InputContainer>
            <InputContainer>
              <Label>Student Name</Label>
              <Input
                type="text"
                name="Name"
                placeholder="Student Name"
                value={formData.Name}
                onChange={handleChange}
                required
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
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label>Mobile Number</Label>
              <Flex>
                <SelectInput
                  options={countryOptions}
                  onChange={handelCountryCodeChange}
                  placeholder="Select a country"
                  isSearchable={true} // Allows the select to be searchable
                  style={{ width: "80px" }} // Smaller width for the select input
                />
                <Input
                  type="text"
                  name="MobileNo"
                  placeholder="Mobile Number"
                  value={formData.MobileNo}
                  onChange={handleChange}
                  required
                  style={{ flex: 1 }} // This will make the input take the remaining space
                />
              </Flex>
            </InputContainer>
            <InputContainer>
              <Label>Mobile Number</Label>
              <Flex>
                <SelectInput
                  options={countryOptions}
                  onChange={handelCountryCodeChange1}
                  placeholder="Select a country"
                  isSearchable={true}
                  style={{ width: "80px" }}
                />
                <Input
                  type="text"
                  name="AlterMobileNo"
                  placeholder="Alternate Mobile Number"
                  value={formData.AlterMobileNo}
                  onChange={handleChange}
                  required
                  style={{ flex: 1 }}
                />
              </Flex>
            </InputContainer>
            <InputContainer>
              <Label>Email</Label>
              <Input
                name="Email"
                placeholder="Email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label>Address</Label>
              <Input
                name="Address"
                placeholder="Address"
                value={formData.Address}
                onChange={handleChange}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label>Country</Label>
              <SelectInput2
                options={countryName}
                onChange={handelCountryChange}
                placeholder="Select a country"
                isSearchable={true} // Allows the select to be searchable
              />
            </InputContainer>
            <InputContainer>
              <Label>State</Label>
              <Input
                type="text"
                name="State"
                placeholder="State"
                value={formData.State}
                onChange={handleChange}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label>PinCode</Label>
              <Input
                type="text"
                name="Pincode"
                placeholder="Pincode"
                value={formData.Pincode}
                onChange={handleChange}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label>Area</Label>
              <Input
                type="text"
                name="Area"
                placeholder="Area"
                value={formData.Area}
                onChange={handleChange}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label>Qualification</Label>
              <Input
                type="text"
                name="Qualification"
                placeholder="Qualification"
                value={formData.Qualification}
                onChange={handleChange}
                required
              />
            </InputContainer>
          </Main>
          {/* Guardian Details inputs */}
          <Heading>Guardian Details</Heading>
          <div>
            {formData.GuardianDetails.map((guardian, index) => (
              <Main key={index}>
                <InputContainer>
                  <Label>Guardian Name</Label>
                  <Input
                    type="text"
                    name="GName"
                    placeholder="Guardian Name"
                    value={guardian.GName}
                    onChange={(e) => handleGuardianChange(index, e)}
                    required
                  />
                </InputContainer>
                <InputContainer>
                  <Label>Guardian Mobile Number</Label>
                  <Input
                    type="text"
                    name="GMobileNo"
                    placeholder="Guardian Mobile Number"
                    value={guardian.GMobileNo}
                    onChange={(e) => handleGuardianChange(index, e)}
                    required
                  />
                </InputContainer>
                <InputContainer>
                  <Label>Guardian Occupation</Label>
                  <Input
                    type="text"
                    name="GOccupation"
                    placeholder="Guardian Occupation"
                    value={guardian.GOccupation}
                    onChange={(e) => handleGuardianChange(index, e)}
                    required
                  />
                </InputContainer>
                <InputContainer></InputContainer>
                {index !== 0 ? (
                  <RemoveButton
                    type="button"
                    onClick={() => removeGuardian(index)}
                  >
                    Remove Guardian
                  </RemoveButton>
                ) : null}
              </Main>
            ))}
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <SubmitButton type="button" onClick={addGuardian}>
                Add Guardian
              </SubmitButton>
            </div>
          </div>

          {/* Course Details inputs */}
          <div style={{ margin: "20px 0" }}>
            <Heading>Course Details</Heading>
            {formData.Course.map((course, index) => (
              <Main key={index}>
                <InputContainer>
                  <Label>Course ID</Label>
                  <Input
                    type="text"
                    name="CourseId"
                    placeholder="Course ID"
                    value={course.CourseId}
                    onChange={(e) => handleCourseChange(index, e)}
                    required
                    disabled
                  />
                </InputContainer>
                <InputContainer>
                  <Label>Course Name</Label>
                  <Select1
                    name="CourseName"
                    value={course.CourseId}
                    onChange={(e) => handleCourseChange(index, e)} // Use the handleFranchiseChange here
                    required
                  >
                    <option value="">Select Course</option>

                    {/* Dynamically render franchise options */}
                    {courses?.length > 0 ? (
                      courses.map((course) => (
                        <option key={course.CourseId} value={course.CourseId}>
                          {course.CourseName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Course Found</option> // Loading state
                    )}
                  </Select1>
                </InputContainer>
                <InputContainer>
                  <Label>Course Duration</Label>
                  <Input
                    type="text"
                    name="CourseDuration"
                    placeholder="Course Duration"
                    value={course.CourseDuration}
                    onChange={(e) => handleCourseChange(index, e)}
                    required
                    disabled
                  />
                </InputContainer>
                <InputContainer>
                  <Label>Fee Mode</Label>
                  <Select1
                    name="FeeMode"
                    value={course.FeeMode} // Use course.FeeMode here for each course
                    onChange={(e) => handleCourseFeeModeChange(index, e)} // Pass the index to the handler
                    required
                  >
                    <option value="">Select Fee Mode</option>

                    {/* Dynamically render fee mode options */}
                    {feeMode.length > 0 ? (
                      feeMode.map((fee, indx) => {
                        if (indx === index) {
                          return fee?.Plans?.map((val, planIndex) => (
                            <option
                              key={`${indx}-${planIndex}`}
                              value={val.PlanName}
                            >
                              {val.PlanName}
                            </option>
                          ));
                        }
                        return null;
                      })
                    ) : (
                      <option disabled>Loading Fee...</option>
                    )}
                  </Select1>
                </InputContainer>
                <InputContainer>
                  <Label>Course Fee</Label>
                  <Input
                    type="text"
                    name="Fee"
                    placeholder="Course Fee"
                    value={course.Fee}
                    onChange={(e) => handleCourseChange(index, e)}
                    required
                    disabled
                  />
                </InputContainer>
                <InputContainer>
                  <Label>Course batch</Label>
                  <Select1
                    name="Hour"
                    value={course.Hour}
                    onChange={(e) => handelHourChange(index, e)} // Use the handleFranchiseChange here
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
                  <Label>Select Slot</Label>
                  <Select1
                    name="CourseName"
                    value={course.Slot}
                    onChange={(e) => handelSlotChange(index, e)} // Use the handleFranchiseChange here
                  >
                    <option value="">Select Slot</option>
                    {/* {console.log(course.Hour)} */}
                    {/* Dynamically render franchise options */}
                    {getSlotsByHour(course.Hour).length > 0 ? (
                      getSlotsByHour(course.Hour).map((slot) => (
                        <option key={slot.SlotTime} value={slot.SlotTime}>
                          {slot.SlotTime}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Slot Found</option> // Loading state
                    )}
                  </Select1>
                </InputContainer>
                <InputContainer>
                  <Label>Discount (In ₹)</Label>
                  <Input
                    name="Discount"
                    placeholder="Discount"
                    value={course.Discount}
                    onChange={(e) => handelDiscountChange(index, e)}
                  />
                </InputContainer>
                <InputContainer>
                  <Label>Additional Charges (In ₹)</Label>
                  <Input
                    name="AdditionalCharge"
                    placeholder="Additional Charge"
                    value={course.Additional}
                    onChange={(e) => handelAdditionChange(index, e)}
                  />
                </InputContainer>
                <RemoveButton type="button" onClick={() => removeCourse(index)}>
                  Remove Course
                </RemoveButton>
              </Main>
            ))}
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <SubmitButton type="button" onClick={addCourse}>
                Add Course
              </SubmitButton>
            </div>
          </div>

          <Main>
            <InputContainer>
              <Label>Upload Image</Label>
              <Input
                type="file"
                name="image"
                onChange={handleImageChange}
                required
              />
            </InputContainer>
          </Main>

          {/* Submit Button */}
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <SubmitButton type="submit">Add Student</SubmitButton>
          </div>
        </Form>
      </FormContainer>
    </MainDashboard>
  );
};

export default AdmissionForm;
