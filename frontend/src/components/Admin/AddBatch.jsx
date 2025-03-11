import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SubmitButton, MainDashboard, Input, Main, Heading, Select1, Option, Label, InputContainer, FormContainer, Title } from '../Styles/GlobalStyles';





const Form = styled.form`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;



const Table = styled.table`
  width: 100%;
  margin-top: 30px;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  th, td {
    padding: 15px;
    text-align: center;
    border: 1px solid #ddd;
  }

  th {
    background-color: #001f3d;
    color: white;
  }

  td {
    color: #7a7a7a;
  }

  .actions button {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #001f3d;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }

  .actions button:hover {
    background-color: #0066cc;
  }
`;

const AddBatch = () => {
    const [franchises, setFranchises] = useState([]);
    const [hour, setHour] = useState('');
    const [franchiseId, setFranchiseId] = useState('');
    const [slots, setSlots] = useState(['']);
    const [batches, setBatches] = useState([]); // Make sure it's an array by default
    const [editingBatchId, setEditingBatchId] = useState(null); // Track batch being edited

    // Fetch all batches on mount
    const fetchBatches = async () => {
        try {
            const response = await axios.get("https://franchiseapi.kictindia.com/batch/all");
            if (response.status === 200) {
                setBatches(response.data); // Set the batches state to the fetched data
                console.log(response.data); // Set the batches state to the fetched data
            }
        } catch (error) {
            console.error("There was an error fetching the batches:", error);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        const fetchFranchises = async () => {
            try {
                const response = await fetch("https://franchiseapi.kictindia.com/franchise/all");
                const data = await response.json();

                if (data && Array.isArray(data)) {
                    setFranchises(data); // Store fetched franchises in state
                    // console.log(data); // Store fetched franchises in state
                }
            } catch (error) {
                console.error("Error fetching franchises:", error);
            }
        };

        fetchFranchises(); // Call the function to fetch franchises
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!hour || slots.some(slot => !slot)) {
            toast.error('Please fill in both Hour and Slots fields.');
            return;
        }

        const batchData = {
            FranchiseId: franchiseId,
            Hour: hour,
            Slots: slots.filter(slot => slot.trim() !== '').map(slot => ({
                SlotTime: slot, // Assigning slot to SlotTime
                Students: []    // Empty array for students
            })),
        };

        try {
            if (editingBatchId) {
                // Optimistic update: Immediately update the local state
                const updatedBatches = batches.map(batch => batch._id === editingBatchId ? { ...batch, ...batchData } : batch);
                setBatches(updatedBatches);

                const response = await axios.put(`https://franchiseapi.kictindia.com/batch/update/${editingBatchId}`, batchData);
                toast.success('Batch updated successfully!');
            } else {
                // Optimistic update: Add the new batch to the UI immediately
                const response = await axios.post('https://franchiseapi.kictindia.com/batch/add', batchData);
                toast.success('Batch added successfully!');
                setBatches(prevBatches => [...prevBatches, response.data]); // Add new batch to local state without overwriting
            }
            setHour('');
            setSlots(['']);
            setEditingBatchId(null); // Reset the editing state
        } catch (err) {
            toast.error('Error saving batch.');
        }
    };

    const handleAddSlot = () => {
        setSlots([...slots, '']);
    };

    const handleSlotChange = (e, index) => {
        const updatedSlots = [...slots];
        updatedSlots[index] = e.target.value;
        setSlots(updatedSlots);
    };

    const handleRemoveSlot = (index) => {
        const updatedSlots = slots.filter((_, i) => i !== index);
        setSlots(updatedSlots);
    };

    const handleDeleteBatch = async (id) => {
        // Optimistically remove the batch from UI
        const updatedBatches = batches.filter(batch => batch._id !== id);
        setBatches(updatedBatches);
        toast.success('Batch deleted successfully');

        try {
            await axios.delete(`https://franchiseapi.kictindia.com/batch/delete/${id}`);
        } catch (err) {
            toast.error('Error deleting batch');
            // Revert state if the deletion failed
            fetchBatches();
        }
    };

    const handleEditBatch = (id) => {
        const batchToEdit = batches.find(batch => batch._id === id);
        setHour(batchToEdit.Hour);
        setSlots(batchToEdit.Slots.map(slot => slot.SlotTime));
        setEditingBatchId(id); // Set editingBatchId to indicate editing mode
    };

    return (
        <MainDashboard>
            {/* <Form onSubmit={handleSubmit}>
                <Title>{editingBatchId ? 'Edit Batch' : 'Add a New Batch'}</Title>

                <Main>
                    <InputContainer>
                        <Label>Franchise</Label>
                        <Select1
                            name="FranchiseName"
                            value={franchiseId}
                            onChange={(e)=> setFranchiseId(e.target.value)} // Use the handleFranchiseChange here
                        >
                            <option value="">Select Franchise</option>

                            {franchises.length > 0 ? (
                                franchises.map((franchise) => (
                                    <option key={franchise.FranchiseID} value={franchise.FranchiseID}>
                                        {franchise.FranchiseName}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading franchises...</option> // Loading state
                            )}
                        </Select1>
                    </InputContainer>
                    <InputContainer>
                        <Label>Hour:</Label>
                        <Input
                            type="text"
                            value={hour}
                            onChange={(e) => setHour(e.target.value)}
                            placeholder="Enter Total Hour"
                            required
                        />
                    </InputContainer>

                    <InputContainer>
                        <Label>Slots:</Label>
                        {slots.map((slot, index) => (
                            <div key={index} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
                                <Input
                                    type="text"
                                    value={slot}
                                    onChange={(e) => handleSlotChange(e, index)}
                                    placeholder="Slot Timing e.g(8.00am - 9.00am)"
                                    required
                                />
                                {slots.length > 1 && (
                                    <SubmitButton
                                        type="button"
                                        onClick={() => handleRemoveSlot(index)}
                                        style={{ marginLeft: '10px', color: 'red', width: '30px', height: '30px', padding: '0', borderRadius: '50%' }}
                                    >
                                        X
                                    </SubmitButton>
                                )}
                            </div>
                        ))}
                        <SubmitButton type="button" onClick={handleAddSlot}>Add Slot</SubmitButton>
                    </InputContainer>
                </Main>

                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <SubmitButton type="submit">
                        {editingBatchId ? 'Update' : 'Submit'}
                    </SubmitButton>
                </div>
            </Form> */}

            <Table>
                <thead>
                    <tr>
                        <th>Franchise Id</th>
                        <th>Hour</th>
                        <th>Slots</th>
                        {/* <th>Actions</th> */}
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(batches) && batches.map((batch, index) => (
                        <tr key={batch._id}>
                            <td>{batch.FranchiseId}</td>
                            <td>{batch.Hour}</td>
                            <td>{Array.isArray(batch.Slots) ? batch.Slots.map(val => val.SlotTime).join(",") : 'No Slots'}</td>
                            {/* <td className="actions">
                                <button onClick={() => handleEditBatch(batch._id)}>Edit</button>
                                <button onClick={() => handleDeleteBatch(batch._id)}>Delete</button>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <ToastContainer />
        </MainDashboard>
    );
};

export default AddBatch;
