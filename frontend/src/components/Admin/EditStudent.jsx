import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Select from "react-dropdown-select";
import countries from "./../../assets/MobileCode.json";
import { useLocation } from "react-router-dom";
import { Form, FormContainer, Heading, Input, InputContainer, Label, Main, MainDashboard, Section, Select1, SubmitButton, Title } from "../Styles/GlobalStyles";

const SelectInput2 = styled(Select)`
  width: 50%;
  padding: 5px 20px;
  border-radius: 5px;
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
`;


const EditStudent = () => {
  const location = useLocation();
  const generateTemporaryRegistrationNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return "KICT-" + randomNum;
  };
  const [formData, setFormData] = useState({
    RegistrationNumber: generateTemporaryRegistrationNumber(),
    StudentID:"",
    AadhaarNumber: "",
    DateofAdmission: "",
    Branch: "",
    FranchiseId: "",
    Name: "",
    Gender: "",
    DOB: "",
    MobileNo: "",
    AlterMobileNo: "",
    Address: "",
    Country: "",
    State: "",
    Pincode: "",
    Area: "",
    Qualification: "",
    GuardianDetails: [{ GName: "", GMobileNo: "", GOccupation: "" }],
    Course: [{ CourseId: "", CourseName: "", CourseDuration: "", FeeMode: "", Fee: "", Hour: "", Slot: "", }],
  });
  const [franchises, setFranchises] = useState([]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [altPhoneCode, setAltPhoneCode] = useState("");
  const [courses, setCourses] = useState("");
  const [feeMode, setFeeMode] = useState([{}]);
  const [batches, setBatches] = useState([]);
  const [slots, setSlots] = useState([]);
  const [allFranchises, setAllFranchises] = useState([]);
  const [defaultSlot, setDefaultSlot] = useState([]);


  const countryOptions = countries.map((country) => ({
    value: country.dial_code,
    label: `${country.name} (${country.dial_code})`,
  }));

  const countryName = countries.map(country => ({
    value: country.name,
    label: country.name
  }));

  useEffect(() => {
    console.log(location.state.StudentID)
    const fetchStudent = async () => {
      try {
        const response = await fetch(`https://franchiseapi.kictindia.com/student/get/${location.state.StudentID}`);
        const data = await response.json();
        console.log(data)
        setFormData(data)
      } catch (error) {
        console.error("Error fetching Student:", error);
      }
    };

    fetchStudent();
  }, [])

  useEffect(() => {
    var temp = localStorage.getItem("Role");

    const fetchFranchises = async () => {
      try {
        const response = await fetch("https://franchiseapi.kictindia.com/franchise/all");
        const data = await response.json();
        setAllFranchises(data);
        if (temp == "Franchise") {
          var id = localStorage.getItem("Id");
          var selectFran = data.find(val => val.FranchiseID == id);
          setFranchises([selectFran])
          setFormData((prev) => ({
            ...prev,
            FranchiseId: selectFran.FranchiseID,
            Branch: selectFran.FranchiseName
          }))
        } else if (temp == "Teacher") {
          var id = JSON.parse(localStorage.getItem("TeacherData"));
          var selectFran = data.find(val => val.FranchiseID == id.FranchiseId);
          setFranchises([selectFran])
          setFormData((prev) => ({
            ...prev,
            FranchiseId: selectFran.FranchiseID,
            Branch: selectFran.FranchiseName
          }))
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
          var franData = allFranchises.find(value => value.FranchiseID == formData.FranchiseId);
          var filterCourse = data.filter(value => value.FranchiseId == "All" || value.FranchiseId == formData.FranchiseId || value.State == franData.State);
          const coursesForFranchise = filterCourse || [];
          setCourses(coursesForFranchise);
          var courseIds = formData.Course.map(value=> value.CourseId)
          var fil = data.map(value =>{
            if(courseIds.includes(value.CourseId)){
              return value.Price
            }
          } )
          setFeeMode(fil)
          console.log(data)
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
          console.log(data)
          // console.log(data); // Store fetched franchises in state
          if (formData.FranchiseId) {
            var filData = data.find(item => item.FranchiseId === formData.FranchiseId);
            setBatches(filData);
            setDefaultSlot(filData.Batch)
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
    setAltPhoneCode(value.value)
  }
  const handelCountryChange = (value) => {
    setFormData({
      ...formData,
      Country: value.value
    });
  }
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
        },
      ],
    });
    setFeeMode([
      ...feeMode,
      {},
    ])
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
    var filData = courses.find(val => val.CourseId === value);
    console.log(filData)
    const updatedCourses = formData.Course.map((course, idx) => idx === index ? { ...course, CourseId: value, CourseName: filData?.CourseName, CourseDuration: filData?.CourseDuration, Hour: "", Fee: "", FeeMode: "", Slot: "" } : course);
    feeMode.map((val, idx) => {
      // console.log(index, idx)
      if (idx === index) {
        feeMode[idx] = filData?.Price
      }
    })
    console.log(updatedCourses)
    setFormData({ ...formData, Course: updatedCourses });
  };

  const handleCourseFeeModeChange = (index, e) => {
    const updatedCourses = [...formData.Course];
    updatedCourses[index].FeeMode = e.target.value;
    console.log(e.target.value)
    var fe = feeMode[index].Plans.find(val => val.PlanName === e.target.value)
    console.log(fe.TotalFee)
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
      var filterSlot = batches.Batch.find(val => val.Hour === e.target.value)
      console.log(filterSlot)
      setSlots(filterSlot.Slots)
    }
    setFormData({ ...formData, Course: updatedCourses });
  }

  const handelSlotChange = (index, e) => {
    const updatedCourses = [...formData.Course];
    updatedCourses[index].Slot = e.target.value;
    setFormData({ ...formData, Course: updatedCourses });
  }


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
        }
      ],
    });
    setFeeMode([
      {}
    ])
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const data = new FormData();
    data.append("image", image);
    for (const key in formData) {
      console.log(typeof formData[key] == 'object')
      if (key === 'MobileNo') {
        data.append(key, formData[key]); // Convert arrays to strings for submission
      } else if (key === 'AlterMobileNo') {
        data.append(key, formData[key]); // Convert arrays to strings for submission
      } else {
        if (typeof formData[key] == 'object') {
          data.append(key, JSON.stringify(formData[key])); // Convert arrays to strings for submission
        } else {
          data.append(key, formData[key]);
        }
      }
    }
    console.log(formData);
    try {
      const response = await axios.put(`https://franchiseapi.kictindia.com/student/update/${formData.StudentID}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('Student added successfully!');

      // Fetch the role from localStorage
      const role = localStorage.getItem('Role');  // Assuming 'role' is saved in localStorage

      // Redirect based on role
      if (role === 'Admin') {
        window.location.href = '/admin/allstudent';
      } else if (role === 'Franchise') {
        window.location.href = '/branch/allstudent';
      } else if (role === 'Teacher') {
        window.location.href = '/teacher/allstudent';
      } else {
        // Default case if the role is not found
        window.location.href = '/';
      }

    } catch (err) {
      console.error(err);
      setError('Error adding student');
    }
  };

  function getSlotsByHour(hour) {
    const found = defaultSlot.find(item => item.Hour === hour);
    return found ? found.Slots : [];
  }

  return (
    <MainDashboard>
      <FormContainer>
        <Title>Edit Student</Title>
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
                    <option key={franchise.FranchiseID} value={franchise.FranchiseName}>
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
              <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
                <Label>Mobile Number</Label>
                {/* <SelectInput
                options={countryOptions}
                onChange={handelCountryCodeChange}
                placeholder="Select a country"
                isSearchable={true} // Allows the select to be searchable
                style={{ width: "80px" }} // Smaller width for the select input
              /> */}
                <Input
                  type="text"
                  name="MobileNo"
                  placeholder="Mobile Number"
                  value={formData.MobileNo}
                  onChange={handleChange}
                  required
                  style={{ flex: 1 }} // This will make the input take the remaining space
                />
              </div>

            </InputContainer>
            <InputContainer>
              <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
                <Label>Mobile Number</Label>
                {/* <SelectInput
                options={countryOptions}
                onChange={handelCountryCodeChange1}
                placeholder="Select a country"
                isSearchable={true}
                style={{ width: "80px" }}
              /> */}
                <Input
                  type="text"
                  name="AlterMobileNo"
                  placeholder="Alternate Mobile Number"
                  value={formData.AlterMobileNo}
                  onChange={handleChange}
                  required
                  style={{ flex: 1 }}
                />
              </div>
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
              <SelectInput2 style={{ padding: "8px", borderRadius: "5px", border: "1px solid black" }}
                value={formData.Country}
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
                {index !== 0 ?
                  <SubmitButton type="button" onClick={() => removeGuardian(index)}>
                    Remove Guardian
                  </SubmitButton>
                  : null}
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
                {/* <InputContainer>
                <Label>Course Name</Label>
                <Input
                  type="text"
                  name="CourseName"
                  placeholder="Course Name"
                  value={course.CourseName}
                  onChange={(e) => handleCourseChange(index, e)}
                  required
                />
              </InputContainer> */}
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
                            <option key={`${indx}-${planIndex}`} value={val.PlanName}>
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
                  {/* <Input
                  type="text"
                  name="Hour"
                  placeholder="Hour"
                  value={course.Batch}
                  onChange={(e) => handelHourChange(index, e)}
                  required
                /> */}
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
                    name="Slot"
                    value={course.Slot}
                    onChange={(e) => handelSlotChange(index, e)} // Use the handleFranchiseChange here
                  >
                    <option value="">Select Slot</option>

                    {/* Dynamically render franchise options */}
                    {getSlotsByHour(course.Hour).length > 0 ? (
                      getSlotsByHour(course.Hour).map((slot) => (
                        <option key={slot.SlotTime} value={slot.SlotTime}>
                          {slot.SlotTime}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Course Found</option> // Loading state
                    )}
                  </Select1>
                </InputContainer>
                <InputContainer></InputContainer>
                <SubmitButton type="button" onClick={() => removeCourse(index)}>
                  Remove Course
                </SubmitButton>
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
          <InputContainer>
            <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
              <Label>Upload Image</Label>
              <Input
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </div>
          </InputContainer>
          {/* Submit Button */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <SubmitButton type="submit">Add Student</SubmitButton>
          </div>
        </Form>
      </FormContainer>
    </MainDashboard>
  );
};

export default EditStudent;
