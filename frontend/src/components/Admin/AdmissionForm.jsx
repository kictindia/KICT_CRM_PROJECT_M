import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Select from "react-select";
import countries from "./../../assets/MobileCode.json";

// Styled-components for the modern blue theme
const ProgressContainer = styled.div`
  width: 100%;
  margin: 30px 0;
  display: flex;
  justify-content: center;
`;

const ProgressSteps = styled.ul`
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
  width: 100%;
  max-width: 800px;
  position: relative;
`;

const ProgressStep = styled.li`
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#2a7fba" : "#e0e0e0")};
  color: ${(props) => (props.active ? "white" : "#9e9e9e")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 3px solid ${(props) => (props.active ? "#2a7fba" : "#e0e0e0")};
  transition: all 0.3s ease;
`;

const StepLabel = styled.span`
  font-size: 14px;
  color: ${(props) => (props.active ? "#2a7fba" : "#9e9e9e")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  height: 4px;
  background-color: #e0e0e0;
  width: 100%;
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #2a7fba;
    width: ${(props) => props.progress}%;
    transition: width 0.4s ease;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  /* max-width: 1200px; */
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #2a7fba;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 600;
  font-size: 28px;
  position: relative;
  
  &::after {
    content: "";
    display: block;
    width: 80px;
    height: 4px;
    background: #2a7fba;
    margin: 10px auto 0;
    border-radius: 2px;
  }
`;

const Form = styled.form`
  width: 100%;
`;

const SectionTitle = styled.h3`
  color: #2a7fba;
  margin: 30px 0 20px;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 20px;
    background: #2a7fba;
    margin-right: 12px;
    border-radius: 4px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  
  &:focus {
    border-color: #2a7fba;
    box-shadow: 0 0 0 3px rgba(42, 127, 186, 0.2);
    outline: none;
  }
  
  &[disabled] {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SelectInput = styled(Select)`
  .react-select__control {
    border: 1px solid #ddd;
    border-radius: 8px;
    min-height: 44px;
    box-shadow: none;
    
    &:hover {
      border-color: #bbb;
    }
    
    &--is-focused {
      border-color: #2a7fba;
      box-shadow: 0 0 0 3px rgba(42, 127, 186, 0.2);
    }
  }
  
  .react-select__value-container {
    padding: 2px 16px;
  }
  
  .react-select__indicator-separator {
    display: none;
  }
  
  .react-select__menu {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .react-select__option {
    padding: 10px 16px;
    font-size: 14px;
    
    &--is-selected {
      background-color: #2a7fba;
    }
    
    &--is-focused {
      background-color: #e6f2fa;
    }
  }
`;

const SelectNative = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  transition: all 0.3s;
  
  &:focus {
    border-color: #2a7fba;
    box-shadow: 0 0 0 3px rgba(42, 127, 186, 0.2);
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #2a7fba;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #1f6ba1;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(42, 127, 186, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: #2a7fba;
  border: 1px solid #2a7fba;
  
  &:hover:not(:disabled) {
    background-color: #f0f7fc;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(42, 127, 186, 0.1);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const DangerButton = styled(Button)`
  background-color: #f44336;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #d32f2f;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #eee;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FileInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const FileInputLabel = styled.label`
  display: block;
  padding: 12px 16px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #2a7fba;
    background-color: #f8fbfe;
  }
`;

const FileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
`;

const AdmissionForm = () => {
  // Form steps
  const steps = ["Personal Details", "Guardian Details", "Course Details", "Review & Submit"];
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(25);

  const [formData, setFormData] = useState({
    RegistrationNumber: "",
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
  
  const generateTemporaryRegistrationNumber = async () => {
    const response = await fetch("http://localhost:8000/student/id");
    const data = await response.json();
    setFormData({...formData, RegistrationNumber: `KICT-${data.Count + 1}`});
  };

  useEffect(() => {
    generateTemporaryRegistrationNumber();
    var temp = localStorage.getItem("Role");
    
    const fetchFranchises = async () => {
      try {
        const response = await fetch("http://localhost:8000/franchise/all");
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
        const response = await fetch("http://localhost:8000/course/all");
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
        const response = await fetch("http://localhost:8000/batch/all");
        const data = await response.json();

        if (data && Array.isArray(data)) {
          if (formData.FranchiseId) {
            var filData = data.find(
              (item) => item.FranchiseId === formData.FranchiseId
            );
            setBatches(filData);
            setDefaultSlot(filData.Batch);
          } else {
            setBatches([]);
          }
        }
      } catch (error) {
        console.error("Error fetching franchises:", error);
      }
    };

    fetchBatch();
  }, [formData.FranchiseId]);

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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const addGuardian = () => {
    setFormData({
      ...formData,
      GuardianDetails: [
        ...formData.GuardianDetails,
        { GName: "", GMobileNo: "", GOccupation: "" },
      ],
    });
  };

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

  const handleGuardianChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGuardians = formData.GuardianDetails.map((guardian, idx) =>
      idx === index ? { ...guardian, [name]: value } : guardian
    );
    setFormData({ ...formData, GuardianDetails: updatedGuardians });
  };

  const handleCourseChange = (index, e) => {
    const { name, value } = e.target;
    var filData = courses.find((val) => val.CourseId === value);
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
      if (idx === index) {
        feeMode[idx] = filData.Price;
      }
    });

    setFormData({ ...formData, Course: updatedCourses });
  };

  const handleCourseFeeModeChange = (index, e) => {
    const updatedCourses = [...formData.Course];
    updatedCourses[index].FeeMode = e.target.value;
    var fe = feeMode[index].Plans.find(
      (val) => val.PlanName === e.target.value
    );
    
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

  const removeGuardian = (index) => {
    const updatedGuardians = formData.GuardianDetails.filter(
      (_, idx) => idx !== index
    );
    setFormData({ ...formData, GuardianDetails: updatedGuardians });
  };

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

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setProgress((currentStep / steps.length) * 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setProgress(((currentStep - 2) / steps.length) * 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", image);
    
    for (const key in formData) {
      if (key === "MobileNo") {
        data.append(key, phoneCode + " " + formData[key]);
      } else if (key === "AlterMobileNo") {
        data.append(key, altPhoneCode + " " + formData[key]);
      } else {
        if (typeof formData[key] == "object") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }
    }
    
    try {
      const response = await axios.post(
        "http://localhost:8000/pending-student/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      alert("Student added successfully!");
      const role = localStorage.getItem("Role");

      if (role === "Admin") {
        window.location.href = "/admin/allstudent";
      } else if (role === "Franchise") {
        window.location.href = "/branch/allstudent";
      } else if (role === "Teacher") {
        window.location.href = "/teacher/allstudent";
      } else {
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
    <div style={{ padding: "20px", backgroundColor: "#f5f9fc", minHeight: "100vh", width:"100%" }}>
      <FormContainer>
        <Title>Student Admission Form</Title>
        
        {/* Progress Bar */}
        <ProgressContainer>
          <ProgressSteps>
            <ProgressLine progress={progress} />
            {steps.map((step, index) => (
              <ProgressStep key={index}>
                <StepNumber active={index + 1 <= currentStep}>
                  {index + 1}
                </StepNumber>
                <StepLabel active={index + 1 <= currentStep}>{step}</StepLabel>
              </ProgressStep>
            ))}
          </ProgressSteps>
        </ProgressContainer>

        <Form onSubmit={handleSubmit}>
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <>
              <SectionTitle>Personal Information</SectionTitle>
              <FormGrid>
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
                  <SelectNative
                    name="Branch"
                    value={formData.Branch}
                    onChange={handleFranchiseChange}
                    required
                  >
                    <option value="">Select Branch</option>
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
                  </SelectNative>
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
                  <SelectNative
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </SelectNative>
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
                  <FlexContainer>
                    <div style={{ width: "120px" }}>
                      <SelectInput
                        options={countryOptions}
                        onChange={handelCountryCodeChange}
                        placeholder="Code"
                        isSearchable={true}
                        classNamePrefix="react-select"
                      />
                    </div>
                    <Input
                      type="text"
                      name="MobileNo"
                      placeholder="Mobile Number"
                      value={formData.MobileNo}
                      onChange={handleChange}
                      required
                      style={{ flex: 1 }}
                    />
                  </FlexContainer>
                </InputContainer>

                <InputContainer>
                  <Label>Alternate Mobile Number</Label>
                  <FlexContainer>
                    <div style={{ width: "120px" }}>
                      <SelectInput
                        options={countryOptions}
                        onChange={handelCountryCodeChange1}
                        placeholder="Code"
                        isSearchable={true}
                        classNamePrefix="react-select"
                      />
                    </div>
                    <Input
                      type="text"
                      name="AlterMobileNo"
                      placeholder="Alternate Mobile Number"
                      value={formData.AlterMobileNo}
                      onChange={handleChange}
                      required
                      style={{ flex: 1 }}
                    />
                  </FlexContainer>
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
                  <SelectInput
                    options={countryName}
                    onChange={handelCountryChange}
                    placeholder="Select a country"
                    isSearchable={true}
                    classNamePrefix="react-select"
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
                  <Label>Pin Code</Label>
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
              </FormGrid>
            </>
          )}

          {/* Step 2: Guardian Details */}
          {currentStep === 2 && (
            <>
              <SectionTitle>Guardian Information</SectionTitle>
              {formData.GuardianDetails.map((guardian, index) => (
                <Card key={index}>
                  <FormGrid>
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

                    {index !== 0 && (
                      <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <DangerButton
                          type="button"
                          onClick={() => removeGuardian(index)}
                        >
                          Remove Guardian
                        </DangerButton>
                      </div>
                    )}
                  </FormGrid>
                </Card>
              ))}
              <div style={{ marginTop: "20px" }}>
                <SecondaryButton type="button" onClick={addGuardian}>
                  Add Another Guardian
                </SecondaryButton>
              </div>
            </>
          )}

          {/* Step 3: Course Details */}
          {currentStep === 3 && (
            <>
              <SectionTitle>Course Information</SectionTitle>
              {formData.Course.map((course, index) => (
                <Card key={index}>
                  <FormGrid>
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
                      <SelectNative
                        name="CourseName"
                        value={course.CourseId}
                        onChange={(e) => handleCourseChange(index, e)}
                        required
                      >
                        <option value="">Select Course</option>
                        {courses?.length > 0 ? (
                          courses.map((course) => (
                            <option key={course.CourseId} value={course.CourseId}>
                              {course.CourseName}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Course Found</option>
                        )}
                      </SelectNative>
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
                      <SelectNative
                        name="FeeMode"
                        value={course.FeeMode}
                        onChange={(e) => handleCourseFeeModeChange(index, e)}
                        required
                      >
                        <option value="">Select Fee Mode</option>
                        {feeMode.length > 0 &&
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
                          })}
                      </SelectNative>
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
                      <Label>Course Batch</Label>
                      <SelectNative
                        name="Hour"
                        value={course.Hour}
                        onChange={(e) => handelHourChange(index, e)}
                        required
                      >
                        <option value="">Select Hour</option>
                        {batches?.Batch?.length > 0 ? (
                          batches?.Batch?.map((batch) => (
                            <option key={batch.Hour} value={batch.Hour}>
                              {batch.Hour}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Hour is Found</option>
                        )}
                      </SelectNative>
                    </InputContainer>

                    <InputContainer>
                      <Label>Select Slot</Label>
                      <SelectNative
                        name="CourseName"
                        value={course.Slot}
                        onChange={(e) => handelSlotChange(index, e)}
                      >
                        <option value="">Select Slot</option>
                        {getSlotsByHour(course.Hour).length > 0 ? (
                          getSlotsByHour(course.Hour).map((slot) => (
                            <option key={slot.SlotTime} value={slot.SlotTime}>
                              {slot.SlotTime}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Slot Found</option>
                        )}
                      </SelectNative>
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

                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                      <DangerButton
                        type="button"
                        onClick={() => removeCourse(index)}
                      >
                        Remove Course
                      </DangerButton>
                    </div>
                  </FormGrid>
                </Card>
              ))}
              <div style={{ marginTop: "20px" }}>
                <SecondaryButton type="button" onClick={addCourse}>
                  Add Another Course
                </SecondaryButton>
              </div>
            </>
          )}

          {/* Step 4: Review and Submit */}
          {currentStep === 4 && (
            <>
              <SectionTitle>Review Information</SectionTitle>
              <Card>
                <h4 style={{ color: "#2a7fba", marginBottom: "20px" }}>Personal Details</h4>
                <FormGrid>
                  <InputContainer>
                    <Label>Registration Number</Label>
                    <p>{formData.RegistrationNumber}</p>
                  </InputContainer>
                  <InputContainer>
                    <Label>Name</Label>
                    <p>{formData.Name}</p>
                  </InputContainer>
                  <InputContainer>
                    <Label>Date of Birth</Label>
                    <p>{formData.DOB}</p>
                  </InputContainer>
                  <InputContainer>
                    <Label>Gender</Label>
                    <p>{formData.Gender}</p>
                  </InputContainer>
                  <InputContainer>
                    <Label>Mobile Number</Label>
                    <p>{phoneCode} {formData.MobileNo}</p>
                  </InputContainer>
                  <InputContainer>
                    <Label>Email</Label>
                    <p>{formData.Email}</p>
                  </InputContainer>
                  <InputContainer>
                    <Label>Address</Label>
                    <p>{formData.Address}</p>
                  </InputContainer>
                  <InputContainer>
                    <Label>Country</Label>
                    <p>{formData.Country}</p>
                  </InputContainer>
                  <InputContainer>
                    <Label>State</Label>
                    <p>{formData.State}</p>
                  </InputContainer>
                </FormGrid>
              </Card>

              <Card>
                <h4 style={{ color: "#2a7fba", marginBottom: "20px" }}>Guardian Details</h4>
                {formData.GuardianDetails.map((guardian, index) => (
                  <div key={index} style={{ marginBottom: index !== formData.GuardianDetails.length - 1 ? "20px" : "0" }}>
                    <FormGrid>
                      <InputContainer>
                        <Label>Guardian Name</Label>
                        <p>{guardian.GName}</p>
                      </InputContainer>
                      <InputContainer>
                        <Label>Guardian Mobile</Label>
                        <p>{guardian.GMobileNo}</p>
                      </InputContainer>
                      <InputContainer>
                        <Label>Occupation</Label>
                        <p>{guardian.GOccupation}</p>
                      </InputContainer>
                    </FormGrid>
                  </div>
                ))}
              </Card>

              <Card>
                <h4 style={{ color: "#2a7fba", marginBottom: "20px" }}>Course Details</h4>
                {formData.Course.map((course, index) => (
                  <div key={index} style={{ marginBottom: index !== formData.Course.length - 1 ? "20px" : "0", paddingBottom: "20px", borderBottom: index !== formData.Course.length - 1 ? "1px solid #eee" : "none" }}>
                    <FormGrid>
                      <InputContainer>
                        <Label>Course Name</Label>
                        <p>{course.CourseName}</p>
                      </InputContainer>
                      <InputContainer>
                        <Label>Duration</Label>
                        <p>{course.CourseDuration}</p>
                      </InputContainer>
                      <InputContainer>
                        <Label>Fee Mode</Label>
                        <p>{course.FeeMode}</p>
                      </InputContainer>
                      <InputContainer>
                        <Label>Fee</Label>
                        <p>₹{course.Fee}</p>
                      </InputContainer>
                      <InputContainer>
                        <Label>Batch</Label>
                        <p>{course.Hour}</p>
                      </InputContainer>
                      <InputContainer>
                        <Label>Slot</Label>
                        <p>{course.Slot}</p>
                      </InputContainer>
                      <InputContainer>
                        <Label>Discount</Label>
                        <p>₹{course.Discount}</p>
                      </InputContainer>
                      <InputContainer>
                        <Label>Additional Charges</Label>
                        <p>₹{course.Additional}</p>
                      </InputContainer>
                    </FormGrid>
                  </div>
                ))}
              </Card>

              <Card>
                <h4 style={{ color: "#2a7fba", marginBottom: "20px" }}>Upload Photo</h4>
                <FileInputContainer>
                  <FileInputLabel htmlFor="image-upload">
                    {image ? image.name : "Click to upload student photo"}
                  </FileInputLabel>
                  <FileInput
                    type="file"
                    id="image-upload"
                    name="image"
                    onChange={handleImageChange}
                    required
                  />
                </FileInputContainer>
              </Card>
            </>
          )}

          {/* Navigation Buttons */}
          <ButtonGroup>
            {currentStep > 1 && (
              <SecondaryButton type="button" onClick={prevStep}>
                Previous
              </SecondaryButton>
            )}
            
            {currentStep < steps.length ? (
              <PrimaryButton type="button" onClick={nextStep}>
                Next
              </PrimaryButton>
            ) : (
              <PrimaryButton type="submit">
                Submit Application
              </PrimaryButton>
            )}
          </ButtonGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </FormContainer>
    </div>
  );
};

export default AdmissionForm;