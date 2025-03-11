import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom'; // UseLocation for accessing data passed from the previous page
import { Form, FormContainer, Heading, Input, Input1, InputContainer, Label, Main, MainDashboard, SubmitButton } from '../Styles/GlobalStyles';



const FormTitle = styled.h1`
  text-align: center;
  color: #333;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;


const Wrapper = styled.div`
    width: 100%;
    overflow-x: auto;
`;

const MarkTable = styled.table`
  width: 1000px;
  margin-top: 1rem;
  border-collapse: collapse;

  input {
    width: 80%;
  }

  th, td {
    padding: 1rem;
    border: 1px solid #ddd;
    text-align: left;
    width: fit-content;
  }

  th {
    background-color: #0066cc;
    color: white;
  }

  td {
    background-color: #f9f9f9;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  @media (max-width: 768px) {
    th, td {
      padding: 0.8rem;
    }
  }
`;

const AddMarkButton = styled.button`
  width: 320px;
  padding: 12px;
  background-color: #001f3d;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
  margin-top: 20px;
  
  @media(max-width: 480px){
    width: 80%;
  }
`;

const Message = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: ${({ isError }) => (isError ? 'red' : 'green')};
  font-size: 1.2rem;
`;

const EditCertificate = () => {
    const location = useLocation(); // Get the certificate data passed from the previous page
    const navigate = useNavigate();
    const certificateData = location.state ? location.state.certificate : null; // Check if certificate data exists

    const [certificateId, setCertificateId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [franchiseId, setFranchiseId] = useState('');
    // const [marks, setMarks] = useState([{ topic: '', totalMark: 0, obtainedMark: 0, grade: '' }]);
    const [marks, setMarks] = useState([{ topic: '', totalMark: 0, obtainedTheoryMark: 0, obtainedPracticalMark: 0, grade: '' }]);
    const [percentage, setPercentage] = useState('');
    const [grade, setGrade] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Use useEffect to pre-populate the form when certificate data is loaded
    useEffect(() => {
        if (certificateData) {
            setCertificateId(certificateData.CertificateId);
            setStudentId(certificateData.StudentId);
            setCourseId(certificateData.CourseId);
            setFranchiseId(certificateData.FranchiseId);
            setMarks(certificateData.Marks || [{ topic: '', totalMark: 0, obtainedMark: 0, grade: '' }]);
            setPercentage(certificateData.Percentage);
            setGrade(certificateData.Grade);
            setDate(certificateData.Date);
        }
    }, [certificateData]);

    // Handle changes to Marks fields and calculate percentage/grade
    const handleMarkChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMarks = [...marks];
        updatedMarks[index][name] = value;
        setMarks(updatedMarks);

        // Recalculate percentage and grade when marks are changed
        calculatePercentageAndGrade();
    };

    const addMark = () => {
        setMarks([...marks, { topic: '', totalMark: 0, obtainedTheoryMark: 0, obtainedPracticalMark: 0, grade: '' }]);
    };

    // Function to calculate percentage and individual grades
    const calculatePercentageAndGrade = () => {
        let totalMarks = 0;
        let obtainedMarks = 0;

        const updatedMarks = marks.map((mark) => {
            // Calculate grade for individual topic
            const individualPercentage = ((Number(mark.obtainedTheoryMark) + Number(mark.obtainedPracticalMark)) / mark.totalMark) * 100;
            let individualGrade = '';

            if (individualPercentage >= 90) {
                individualGrade = 'A+';
            } else if (individualPercentage >= 80) {
                individualGrade = 'A';
            } else if (individualPercentage >= 70) {
                individualGrade = 'B+';
            } else if (individualPercentage >= 60) {
                individualGrade = 'B';
            } else if (individualPercentage >= 50) {
                individualGrade = 'C';
            } else {
                individualGrade = 'F';
            }

            mark.grade = individualGrade;

            // Update total and obtained marks
            totalMarks += parseFloat(mark.totalMark || 0);
            obtainedMarks += parseFloat((Number(mark.obtainedTheoryMark) + Number(mark.obtainedPracticalMark)) || 0);

            return mark;
        });

        // Set the updated marks and calculate overall percentage
        setMarks(updatedMarks);
        console.log( typeof obtainedMarks)
        const newPercentage = (obtainedMarks / totalMarks) * 100;
        setPercentage(newPercentage.toFixed(2));

        // Determine overall grade based on total percentage
        let newGrade = '';
        if (newPercentage >= 90) {
            newGrade = 'A+';
        } else if (newPercentage >= 80) {
            newGrade = 'A';
        } else if (newPercentage >= 70) {
            newGrade = 'B+';
        } else if (newPercentage >= 60) {
            newGrade = 'B';
        } else if (newPercentage >= 50) {
            newGrade = 'C';
        } else {
            newGrade = 'F';
        }

        setGrade(newGrade);
    };

    // Handle form submission (for editing)
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage('');
        setError('');

        const updatedCertificateData = {
            CertificateId: certificateId,
            StudentId: studentId,
            CourseId: courseId,
            FranchiseId: franchiseId,
            Marks: marks,
            Percentage: percentage,
            Grade: grade,
            Date: date
        };

        try {
            const response = await axios.put(`https://franchiseapi.kictindia.com/certificates/update/${certificateData._id}`, updatedCertificateData);
            setMessage(response.data.message);
            navigate('/admin/list-certificate'); // Redirect after successful update
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error updating certificate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainDashboard>
            <FormContainer>
                <Heading>Edit Certificate</Heading>
                <Form onSubmit={handleSubmit}>
                    <Main>
                        <InputContainer>
                            <Label>Certificate ID:</Label>
                            <Input
                                type="text"
                                value={certificateId}
                                onChange={(e) => setCertificateId(e.target.value)}
                                required
                                readOnly
                            />
                        </InputContainer>
                        <InputContainer>
                            <Label>Student ID:</Label>
                            <Input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                readOnly
                            />
                        </InputContainer>
                        <InputContainer>
                            <Label>Course ID:</Label>
                            <Input
                                type="text"
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                required
                                readOnly
                            />
                        </InputContainer>
                        <InputContainer>
                            <Label>Franchise ID:</Label>
                            <Input
                                type="text"
                                value={franchiseId}
                                onChange={(e) => setFranchiseId(e.target.value)}
                                required
                                readOnly
                            />
                        </InputContainer>
                    </Main>

                    <div>
                        <InputGroup>
                            <Label>Marks:</Label>
                            <Wrapper>
                                <MarkTable>
                                    <thead>
                                        <tr>
                                            <th>Topic</th>
                                            <th>Total Marks</th>
                                            <th>Theory Marks</th>
                                            <th>Practical Marks</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {marks.map((mark, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Input
                                                        type="text"
                                                        name="topic"
                                                        value={mark.topic}
                                                        onChange={(e) => handleMarkChange(index, e)}
                                                        placeholder="Topic"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        type="number"
                                                        name="totalMark"
                                                        value={mark.totalMark}
                                                        onChange={(e) => handleMarkChange(index, e)}
                                                        placeholder="Total Marks"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        type="number"
                                                        name="obtainedTheoryMark"
                                                        value={mark.obtainedTheoryMark}
                                                        onChange={(e) => handleMarkChange(index, e)}
                                                        placeholder="Theory Marks"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        type="number"
                                                        name="obtainedPracticalMark"
                                                        value={mark.obtainedPracticalMark}
                                                        onChange={(e) => handleMarkChange(index, e)}
                                                        placeholder="Practical Marks"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        type="text"
                                                        name="grade"
                                                        value={mark.grade}
                                                        onChange={(e) => handleMarkChange(index, e)}
                                                        placeholder="Grade"
                                                        readOnly
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </MarkTable>
                                <AddMarkButton type="button" onClick={addMark}>Add Another Mark</AddMarkButton>
                            </Wrapper>
                        </InputGroup>
                    </div>

                    <Main>
                        <InputContainer>
                            <Label>Overall Percentage:</Label>
                            <Input
                                type="number"
                                value={percentage}
                                readOnly
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Overall Grade:</Label>
                            <Input
                                type="text"
                                value={grade}
                                readOnly
                            />
                        </InputContainer>

                        <InputContainer>
                            <Label>Date:</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </InputContainer>
                    </Main>

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? 'Updating Certificate...' : 'Update Certificate'}
                    </SubmitButton>
                </Form>

                {message && <Message>{message}</Message>}
                {error && <Message isError>{error}</Message>}
            </FormContainer>
        </MainDashboard>
    );
};

export default EditCertificate;