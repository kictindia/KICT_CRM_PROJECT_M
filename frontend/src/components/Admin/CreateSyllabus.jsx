import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import styled from "styled-components";
import StateData from "./../../assets/State.json"
import { FormContainer, Heading, Input, InputContainer, Label, Main, MainDashboard, Section, SubmitButton, Title } from "../Styles/GlobalStyles";


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

const AddButton = styled.button`
  background-color: #001f3d;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 15px;
  margin-left: 10px;
  &:hover {
    background-color: #0066cc;
  }
  @media (max-width: z480px){
    margin: 10px;
  }
`;

const AddButtonSyllabus = styled.button`
background-color: #001f3d;
color: white;
border: none;
border-radius: 30px;
font-size: 14px;
cursor: pointer;
height: 50px;
&:hover {
  background-color: #0066cc;
} 
@media (max-width: 480px){
    margin: 10px;
}
`;

const RemoveButton = styled.button`
  background-color: #001f3d;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  margin: 15px;

  &:hover {
    background-color: #0066cc;
  }
`;

const Form = styled.div`
width: 100%;
max-width: 1200px;
margin: 0 auto;
`;


const CreateSyllabus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [courseId, setCourseId] = useState("");
    const [syllabus, setSyllabus] = useState([{ Title: "", Topics: [""] }]);
    const [content, setContent] = useState([{
        Title: "",
        Topics: [{ TopicName: "", VideoLink: "" }]
    }]);
    const [price, setPrice] = useState({
        BaseFee: 0,
        Plans: [{ PlanName: "", TotalFee: 0, Installment: [0] }]
    });

    // New state variables for additional fields
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [courseDuration, setCourseDuration] = useState("");
    const [category, setCategory] = useState("");
    const [stateData, setStateData] = useState([]);
    const [franchiseData, setFranchiseData] = useState([]);
    const [franchiseId, setFranchiseId] = useState("");
    const [state, setState] = useState(null);


    useEffect(() => {
        // Convert the JSON object into an array of options for react-select
        const formattedData = Object.entries(StateData).map(([label, value]) => ({
            label: `${label}`, // Display state with code
            value: `${label}`,
        }));
        formattedData.unshift({
            label: "Select a State",
            value: "",
        })
        setStateData(formattedData);
        // console.log(formattedData);
    }, []);

    useEffect(() => {
        const fetchFran = async () => {
            try {
                const response = await axios.get("http://localhost:8000/franchise/all");
                // console.log(response.data)
                const formattedData = response.data.map((franchise) => ({
                    label: franchise.FranchiseName,
                    value: franchise.FranchiseID,
                }))
                formattedData.unshift({
                    label: "All Franchise",
                    value: "All",
                })
                setFranchiseData(formattedData)
                // console.log(formattedData)
            } catch (error) {
                console.error("There was an error fetching the courses:", error);
            }
        };

        fetchFran();
    }, []);

    // Using courseId from the location state
    useEffect(() => {
        if (location.state && location.state.courseId) {
            setCourseId(location.state.courseId); // Set courseId from location
        }
    }, [location]);

    useEffect(() => {
        if (courseId) {
            fetchCourseData(courseId);  // Fetch course data when courseId is set
        }
    }, [courseId, franchiseData]);

    const fetchCourseData = async (courseId) => {
        try {
            const response = await axios.get(`http://localhost:8000/course/get/${courseId}`);
            setSyllabus(response.data.Syllabus || [{ Title: "", Topics: [""] }]);
            setContent(response.data.Content || [{
                Title: "",
                Topics: [{ TopicName: "", VideoLink: "" }]
            }]);
            setPrice(response.data.Price || { BaseFee: 0, Plans: [{ PlanName: "", TotalFee: 0, Installment: [0] }] });

            // Set the new fields from the response data
            setCourseName(response.data.CourseName || "");
            setCourseDescription(response.data.CourseDescription || "");
            setCourseDuration(response.data.CourseDuration || "");
            setCategory(response.data.Category || "");
            setState({ label: response.data.State, value: response.data.State})
            var selFran = franchiseData.find(data => data.value === response.data.FranchiseId)
            setFranchiseId(selFran)
            // console.log({ label: response.data.State, value: response.data.State})
        } catch (error) {
            console.error("Error fetching course data:", error);
        }
    };

    const handleStateChange = (selectedOption) => {
        setState(selectedOption)
    };

    const handelFranchise = (selectedOption) => {
        setFranchiseId(selectedOption)
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const syllabusData = {
            CourseId: courseId,
            Syllabus: syllabus,
            Content: content,
            Price: price,
            CourseName: courseName,
            CourseDescription: courseDescription,
            CourseDuration: courseDuration,
            Category: category,
            State: state.value,
            FranchiseId: franchiseId.value
        };
        console.log(syllabusData)

        try {
            const response = await axios.put(`http://localhost:8000/course/update/${courseId}`, syllabusData);
            if (response.status === 200) {
                alert("Syllabus updated successfully!");
                setSyllabus([{ Title: "", Topics: [""] }]);
                setContent([{
                    Title: "",
                    Topics: [{ TopicName: "", VideoLink: "" }]
                }]);
                setPrice({
                    BaseFee: 0,
                    Plans: [{ PlanName: "", TotalFee: 0, Installment: [0] }]
                });
                setCourseName("");
                setCourseDescription("");
                setCourseDuration("");
                setCategory("");
                navigate('/admin/allcourse');
            } else {
                alert("Failed to update syllabus. Please try again.");
            }
        } catch (error) {
            console.error("There was an error updating the syllabus:", error);
            alert("Error occurred while updating the syllabus.");
        }
    };

    const handleSyllabusChange = (index, field, value) => {
        const updatedSyllabus = [...syllabus];
        updatedSyllabus[index][field] = value;
        setSyllabus(updatedSyllabus);
    };

    const handleAddSyllabus = () => {
        setSyllabus([...syllabus, { Title: "", Topics: [""] }]);
    };

    const handleRemoveSyllabus = (index) => {
        const updatedSyllabus = syllabus.filter((_, i) => i !== index);
        setSyllabus(updatedSyllabus);
    };

    const handleTopicChange = (syllabusIndex, topicIndex, value) => {
        const updatedSyllabus = [...syllabus];
        updatedSyllabus[syllabusIndex].Topics[topicIndex] = value;
        setSyllabus(updatedSyllabus);
    };

    const handleAddTopic = (syllabusIndex) => {
        const updatedSyllabus = [...syllabus];
        updatedSyllabus[syllabusIndex].Topics.push("");
        setSyllabus(updatedSyllabus);
    };

    const handleRemoveTopic = (syllabusIndex, topicIndex) => {
        const updatedSyllabus = [...syllabus];
        updatedSyllabus[syllabusIndex].Topics.splice(topicIndex, 1);
        setSyllabus(updatedSyllabus);
    };

    const handleContentChange = (index, field, value) => {
        const updatedContent = [...content];
        updatedContent[index][field] = value;
        setContent(updatedContent);
    };

    const handleTopicContentChange = (contentIndex, topicIndex, field, value) => {
        const updatedContent = [...content];
        updatedContent[contentIndex].Topics[topicIndex][field] = value;
        setContent(updatedContent);
    };

    const handleAddContent = () => {
        setContent([
            ...content,
            {
                Title: "",
                Topics: [{ TopicName: "", VideoLink: "" }]
            }
        ]);
    };

    const handleRemoveContent = (index) => {
        const updatedContent = content.filter((_, i) => i !== index);
        setContent(updatedContent);
    };

    const handleAddTopicVideo = (contentIndex) => {
        const updatedContent = [...content];
        updatedContent[contentIndex].Topics.push({ TopicName: "", VideoLink: "" });
        setContent(updatedContent);
    };

    const handleRemoveTopicVideo = (contentIndex, topicIndex) => {
        const updatedContent = [...content];
        updatedContent[contentIndex].Topics.splice(topicIndex, 1);
        setContent(updatedContent);
    };

    const handlePlanChange = (planIndex, field, value) => {
        const updatedPlans = [...price.Plans];
        updatedPlans[planIndex][field] = value;
        setPrice({ ...price, Plans: updatedPlans });
    };

    const handleInstallmentChange = (planIndex, installmentIndex, value) => {
        const updatedPlans = [...price.Plans];
        updatedPlans[planIndex].Installment[installmentIndex] = value;
        setPrice({ ...price, Plans: updatedPlans });
    };

    const handleAddPlan = () => {
        setPrice({
            ...price,
            Plans: [
                ...price.Plans,
                { PlanName: "", TotalFee: 0, Installment: [0] }
            ]
        });
    };

    const handleRemovePlan = (index) => {
        const updatedPlans = price.Plans.filter((_, i) => i !== index);
        setPrice({ ...price, Plans: updatedPlans });
    };

    const handleAddInstallment = (planIndex) => {
        const updatedPlans = [...price.Plans];
        updatedPlans[planIndex].Installment.push(0);
        setPrice({ ...price, Plans: updatedPlans });
    };

    return (
        <MainDashboard>
            <FormContainer>
                <Title>Update Syllabus for Course {courseId}</Title>
                {syllabus.length > 0 && content.length > 0 && price.Plans.length > 0 && (
                    <Form>
                        <Section>
                            <Heading>Course Details</Heading>
                        </Section>
                        <Main>
                            {/* Course Name */}
                            <InputContainer>
                                <Label>Course Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter Course Name"
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                />
                            </InputContainer>

                            {/* Course Description */}
                            <InputContainer>
                                <Label>Course Description</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter Course Description"
                                    value={courseDescription}
                                    onChange={(e) => setCourseDescription(e.target.value)}
                                />
                            </InputContainer>

                            {/* Course Duration */}
                            <InputContainer>
                                <Label>Course Duration</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter Course Duration"
                                    value={courseDuration}
                                    onChange={(e) => setCourseDuration(e.target.value)}
                                />
                            </InputContainer>
                            {/* Category */}

                            <InputContainer>
                                <Label>Category</Label>
                                <Selects
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Basic Software">Basic Software</option>
                                    <option value="Graphic Software">Graphic Software</option>
                                    <option value="Interior Software">Interior Software</option>
                                    <option value="Programming">Programming</option>
                                    <option value="Other Software">Other Software</option>
                                    <option value="Combine Course">Combine Course</option>
                                </Selects>
                            </InputContainer>
                            <InputContainer>
                                <Label>Franchise</Label>
                                <SelectInput
                                    options={franchiseData}
                                    value={franchiseId}
                                    onChange={handelFranchise}
                                    placeholder="Select a Franchise"
                                    isSearchable={true}
                                />
                            </InputContainer>
                            <InputContainer>
                                <Label>State</Label>
                                <SelectInput
                                    options={stateData}
                                    value={state}
                                    onChange={handleStateChange}
                                    placeholder="Select a State"
                                    isSearchable={true}
                                />
                            </InputContainer>
                        </Main>


                        <Heading>Syllabus Details</Heading>
                        <Main>
                            {syllabus.map((item, index) => (
                                <div key={index}>
                                    <InputContainer>
                                        <Label>Syllabus Title</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter Syllabus Title"
                                            value={item.Title}
                                            onChange={(e) => handleSyllabusChange(index, "Title", e.target.value)}
                                        />
                                    </InputContainer>

                                    {item.Topics.map((topic, topicIndex) => (
                                        <div key={topicIndex}>
                                            <InputContainer>
                                                <Label>Topic</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Topic"
                                                    value={topic}
                                                    onChange={(e) =>
                                                        handleTopicChange(index, topicIndex, e.target.value)
                                                    }
                                                />
                                            </InputContainer>
                                            <RemoveButton onClick={() => handleRemoveTopic(index, topicIndex)}>
                                                Remove Topic
                                            </RemoveButton>
                                        </div>
                                    ))}
                                    <AddButton onClick={() => handleAddTopic(index)}>Add Topic</AddButton>
                                    <RemoveButton onClick={() => handleRemoveSyllabus(index)}>
                                        Remove Syllabus
                                    </RemoveButton>
                                </div>
                            ))}
                            <AddButtonSyllabus onClick={handleAddSyllabus}>Add Syllabus</AddButtonSyllabus>

                        </Main>

                        <Heading>Content Details</Heading>
                        <Main>
                            {/* Content Section */}
                            {content.map((contentItem, contentIndex) => (
                                <div key={contentIndex}>
                                    <InputContainer>
                                        <Label>Content Title</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter Content Title"
                                            value={contentItem.Title}
                                            onChange={(e) =>
                                                handleContentChange(contentIndex, "Title", e.target.value)
                                            }
                                        />
                                    </InputContainer>

                                    {contentItem.Topics.map((topic, topicIndex) => (
                                        <div key={topicIndex}>
                                            <InputContainer>
                                                <Label>Topic Name</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Topic Name"
                                                    value={topic.TopicName}
                                                    onChange={(e) =>
                                                        handleTopicContentChange(contentIndex, topicIndex, "TopicName", e.target.value)
                                                    }
                                                />
                                            </InputContainer>

                                            <InputContainer>
                                                <Label>Video Link</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter Video Link"
                                                    value={topic.VideoLink}
                                                    onChange={(e) =>
                                                        handleTopicContentChange(contentIndex, topicIndex, "VideoLink", e.target.value)
                                                    }
                                                />
                                            </InputContainer>

                                            <RemoveButton
                                                onClick={() => handleRemoveTopicVideo(contentIndex, topicIndex)}
                                            >
                                                Remove Topic
                                            </RemoveButton>
                                        </div>
                                    ))}
                                    <AddButton onClick={() => handleAddTopicVideo(contentIndex)}>Add Topic</AddButton>
                                    <RemoveButton onClick={() => handleRemoveContent(contentIndex)}>
                                        Remove Content
                                    </RemoveButton>
                                </div>
                            ))}

                            <AddButtonSyllabus onClick={handleAddContent}>Add Content</AddButtonSyllabus>
                        </Main>
                        {/* Pricing Section */}
                        <Heading>Pricing Details</Heading>
                        <Main>
                            <InputContainer>
                                <Label>Base Fee</Label>
                                <Input
                                    type="number"
                                    value={price.BaseFee}
                                    onChange={(e) => setPrice({ ...price, BaseFee: e.target.value })}
                                />
                            </InputContainer>

                            {price.Plans.map((plan, planIndex) => (
                                <div key={planIndex}>
                                    <InputContainer>
                                        <Label>Plan Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter Plan Name"
                                            value={plan.PlanName}
                                            onChange={(e) =>
                                                handlePlanChange(planIndex, "PlanName", e.target.value)
                                            }
                                        />
                                    </InputContainer>

                                    <InputContainer>
                                        <Label>Total Fee</Label>
                                        <Input
                                            type="number"
                                            placeholder="Enter Total Fee"
                                            value={plan.TotalFee}
                                            onChange={(e) =>
                                                handlePlanChange(planIndex, "TotalFee", e.target.value)
                                            }
                                        />
                                    </InputContainer>

                                    {/* Installments */}
                                    {plan.Installment.map((installment, installmentIndex) => (
                                        <InputContainer key={installmentIndex}>
                                            <Label>Installment {installmentIndex + 1}</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter Installment Fee"
                                                value={installment}
                                                onChange={(e) =>
                                                    handleInstallmentChange(planIndex, installmentIndex, e.target.value)
                                                }
                                            />
                                        </InputContainer>
                                    ))}

                                    <AddButton onClick={(e) => handleAddInstallment(planIndex, e)}>
                                        Add Installment
                                    </AddButton>

                                    <RemoveButton onClick={(e) => handleRemovePlan(planIndex, e)}>
                                        Remove Plan
                                    </RemoveButton>
                                </div>
                            ))}

                            <AddButtonSyllabus onClick={handleAddPlan}>Add Plan</AddButtonSyllabus>
                        </Main>

                        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
                    </Form>
                )}
            </FormContainer>
        </MainDashboard>
    );
};

export default CreateSyllabus;

