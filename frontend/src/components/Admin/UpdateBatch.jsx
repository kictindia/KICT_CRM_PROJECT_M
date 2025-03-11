import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Form, Heading, Input, Input1, Input2, InputContainer, Label, Main, MainDashboard, SubmitButton } from "../Styles/GlobalStyles";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;


const BatchContainer = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #fff;
`;

const BatchHeading = styled.h2`
  font-size: 20px;
  color: #0066cc;
  margin-bottom: 10px;
`;

const SlotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-start;
  margin-bottom: 15px;
  width: auto;

`;

const SlotItem = styled.div`
  flex: 1 1 30%;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  @media (max-width: 450px){
    flex: 1 1 45%;
  }
`;

const SlotHeading = styled.h3`
  font-size: 18px;
  color: #0066cc;
  margin-bottom: 10px;
`;


const AddButton = styled.button`
  background-color: #001f3d;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const RemoveButton = styled.button`
  background-color: red;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;

  &:hover {
    background-color: #c82333;
  }
`;


const UpdateBatch = ({ batchId = "674fdb1fb16702c3bc6ab872" }) => {
    const [updateBatchId, setUpdateBatchId] = useState("");
    const [batchData, setBatchData] = useState({
        FranchiseId: "",
        Batch: [
            {
                Hour: "",
                Slots: [
                    {
                        SlotTime: "",
                        Students: [
                            {
                                StudentId: "",
                                StudentName: "",
                            },
                        ],
                    },
                ],
            },
        ],
    });

    // Fetch current batch data to populate the form
    useEffect(() => {
        var id = localStorage.getItem("Id");
        axios
            .get(`https://franchiseapi.kictindia.com/batch/get/franchise/${id}`)
            .then((response) => {
                setBatchData(response.data);
                console.log(response.data);
                setUpdateBatchId(response.data._id)
            })
            .catch((error) => {
                console.error("Error fetching batch data:", error);
            });
    }, [batchId]);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value, dataset } = e.target;
        const updatedBatchData = { ...batchData };

        if (name === "FranchiseId") {
            updatedBatchData.FranchiseId = value;
        } else {
            // Split the dataset index to target nested arrays
            const [batchIndex, slotIndex, field] = dataset.index.split(".");

            if (slotIndex !== undefined) {
                updatedBatchData.Batch[batchIndex].Slots[slotIndex][field] = value;
            }
            else if (batchIndex !== undefined) {
                updatedBatchData.Batch[batchIndex][field] = value;
            }
        }

        // Set updated state
        setBatchData(updatedBatchData);
    };

    // Handle adding a new batch
    const handleAddBatch = () => {
        const updatedBatchData = { ...batchData };
        updatedBatchData.Batch.push({
            Hour: "",
            Slots: [
                {
                    SlotTime: "",
                    Students: [
                        {
                            StudentId: "",
                            StudentName: "",
                        },
                    ],
                },
            ],
        });
        setBatchData(updatedBatchData);
    };

    // Handle removing a batch (optional)
    const handleRemoveBatch = (batchIndex) => {
        const updatedBatchData = { ...batchData };
        updatedBatchData.Batch.splice(batchIndex, 1);
        setBatchData(updatedBatchData);
    };

    // Handle adding a slot to a batch
    const handleAddSlot = (batchIndex) => {
        const updatedBatchData = { ...batchData };
        updatedBatchData.Batch[batchIndex].Slots.push({
            SlotTime: "",
            Students: [
                {
                    StudentId: "",
                    StudentName: "",
                },
            ],
        });
        setBatchData(updatedBatchData);
    };

    // Handle removing a slot from a batch
    const handleRemoveSlot = (batchIndex, slotIndex) => {
        const updatedBatchData = { ...batchData };
        updatedBatchData.Batch[batchIndex].Slots.splice(slotIndex, 1);
        setBatchData(updatedBatchData);
    };

    // Handle adding a student to a slot
    const handleAddStudent = (batchIndex, slotIndex) => {
        const updatedBatchData = { ...batchData };
        updatedBatchData.Batch[batchIndex].Slots[slotIndex].Students.push({
            StudentId: "",
            StudentName: "",
        });
        setBatchData(updatedBatchData);
    };

    // Handle removing a student from a slot
    const handleRemoveStudent = (batchIndex, slotIndex, studentIndex) => {
        const updatedBatchData = { ...batchData };
        updatedBatchData.Batch[batchIndex].Slots[slotIndex].Students.splice(studentIndex, 1);
        setBatchData(updatedBatchData);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .put(`https://franchiseapi.kictindia.com/batch/update/${updateBatchId}`, batchData)
            .then((response) => {
                console.log("Batch updated successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error updating batch:", error);
            });
    };

    return (
        <MainDashboard>
            <Container>
                <Heading>Update Batch</Heading>
                <Form onSubmit={handleSubmit}>
                    {batchData.Batch.map((batch, batchIndex) => (
                        <BatchContainer key={batchIndex}>
                            <BatchHeading>Batch {batchIndex + 1}</BatchHeading>
                            <Main>
                                <InputContainer>
                                    <Label>Hour</Label>
                                    <Input2
                                        type="text"
                                        name="Hour"
                                        value={batch.Hour}
                                        onChange={(e) => handleChange(e)}
                                        readOnly
                                    />
                                </InputContainer>
                            </Main>

                            <SlotContainer>
                                {batch.Slots.map((slot, slotIndex) => (
                                    <SlotItem key={slotIndex}>
                                        <SlotHeading>Slot {slotIndex + 1}</SlotHeading>
                                        <InputContainer>
                                            <Label>Slot Time</Label>
                                            <Input
                                                type="text"
                                                name="SlotTime"
                                                value={slot.SlotTime}
                                                data-index={`${batchIndex}.${slotIndex}.SlotTime`}
                                                onChange={handleChange}
                                            />
                                        </InputContainer>
                                        <RemoveButton
                                            type="button"
                                            onClick={() => handleRemoveSlot(batchIndex, slotIndex)}
                                        >
                                            Remove Slot
                                        </RemoveButton>
                                    </SlotItem>
                                ))}
                            </SlotContainer>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <AddButton type="button" onClick={() => handleAddSlot(batchIndex)}>
                                    Add Slot
                                </AddButton>
                                <RemoveButton
                                    type="button"
                                    onClick={() => handleRemoveBatch(batchIndex)}
                                >
                                    Remove Batch
                                </RemoveButton>
                            </div>

                        </BatchContainer>
                    ))}

                    <SubmitButton type="submit">Update Batch</SubmitButton>
                </Form>
            </Container>
        </MainDashboard>
    );
};

export default UpdateBatch;
