import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { SubmitButton, MainDashboard, Main, Heading, Select1, Option, Label, InputContainer, FormContainer, Title } from '../Styles/GlobalStyles';





const FormTitle = styled.h1`
  text-align: center;
  color: #333;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;



const Input = styled.input`
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  &:focus {
    border-color: #007bff;
  }
`;

const Button = styled.button`
 width: 320px;
  padding: 12px;
  background: linear-gradient(193deg, #001f3d 4.05%, #0066cc 28.84% );
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
  margin-top: 20px;

  &:hover {
    background: linear-gradient(193deg, #001f3d 4.05%, #0066cc 28.84%);
  }
  
  @media(max-width: 480px){
    width: 80%;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
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
    width: 90%;
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
  background: linear-gradient(193deg, #001f3d 4.05%, #0066cc 28.84% );
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
  margin-top: 20px;

  &:hover {
    background: linear-gradient(193deg, #001f3d 4.05%, #0066cc 28.84%);
  }
  
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

const Form = styled.form`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;


const AddCertificate = () => {
    const location = useLocation();
    const [studentId, setStudentId] = useState(location.state?.studentId || "");
    const [courseId, setCourseId] = useState(location.state?.courseId || "");
    const [franchiseId, setFranchiseId] = useState(location.state?.franchiseId || "");
    const [marks, setMarks] = useState([{ topic: '', totalMark: 0, obtainedTheoryMark: 0, obtainedPracticalMark: 0, grade: '' }]);
    const [percentage, setPercentage] = useState('');
    const [grade, setGrade] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/course/get/${courseId}`);
                const data = response.data;
                var temp = data.Syllabus.map((data) => {
                    return { topic: data.Title, totalMark: 0, obtainedTheoryMark: 0, obtainedPracticalMark: 0, grade: '' }
                })
                setMarks(temp)
            } catch (err) {
                console.log(err);
            }
        }

        fetchData()
    }, [courseId])

    // Function to calculate percentage, grade for individual marks and overall grade
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
        console.log(typeof obtainedMarks)
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

    // Handle change in the Marks fields (dynamic array of marks)
    const handleMarkChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMarks = [...marks];
        updatedMarks[index][name] = value;
        setMarks(updatedMarks);

        // Recalculate percentage and grade when marks are changed
        calculatePercentageAndGrade();
    };

    // Add a new empty set of marks
    const addMark = () => {
        setMarks([...marks, { topic: '', totalMark: 0, obtainedTheoryMark: 0, obtainedPracticalMark: 0, grade: '' }]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage('');
        setError('');

        const certificateData = {
            StudentId: studentId,
            CourseId: courseId,
            FranchiseId: franchiseId,
            Marks: marks,
            Percentage: percentage,
            Grade: grade,
            Date: date
        };

        try {
            const response = await axios.post('http://localhost:8000/certificates/add', certificateData);
            setMessage(response.data.message);
            setStudentId('');
            setCourseId('');
            setFranchiseId('');
            setMarks([{ topic: '', totalMark: 0, obtainedTheoryMark: 0, obtainedPracticalMark: 0, grade: '' }]);
            setPercentage('');
            setGrade('');
            setDate('');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error adding certificate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainDashboard>
            <FormContainer>
                <Heading>Add Certificate</Heading>
                <Form onSubmit={handleSubmit}>
                    <Main>

                        <InputGroup>
                            <Label>Student ID:</Label>
                            <Input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                readOnly
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Course ID:</Label>
                            <Input
                                type="text"
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                required
                                readOnly
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Franchise ID:</Label>
                            <Input
                                type="text"
                                value={franchiseId}
                                onChange={(e) => setFranchiseId(e.target.value)}
                                required
                                readOnly
                            />
                        </InputGroup>
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
                                                        readOnly
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
                                
                            </Wrapper>
                        </InputGroup>
                    </div>
                    <Main>

                        <InputGroup>
                            <Label>Overall Percentage:</Label>
                            <Input
                                type="number"
                                value={percentage}
                                readOnly
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Overall Grade:</Label>
                            <Input
                                type="text"
                                value={grade}
                                readOnly
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Date:</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </InputGroup>
                    </Main>

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? 'Adding Certificate...' : 'Add Certificate'}
                    </SubmitButton>
                </Form>

                {message && <Message>{message}</Message>}
                {error && <Message isError>{error}</Message>}
            </FormContainer>
        </MainDashboard>
    );
};

export default AddCertificate;
