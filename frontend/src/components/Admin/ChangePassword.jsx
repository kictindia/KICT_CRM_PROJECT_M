import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { MainDashboard } from '../Styles/GlobalStyles';



const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  /* width: 96%; */
  max-width: 500px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #001f3d;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #001f3d;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    border-color: #7130E4;
    outline: none;
  }
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  padding: 12px;
  background: #12192c;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  transition: all 0.3s ease;
  margin-top: 20px;
  &:hover {
    background: white;
    color: #12192c;
    border: 2px solid #12192c;
    animation: bounce 0.5s ease-out;
  }
  @keyframes bounce {
    0% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
    50% { transform: translateY(0); }
    70% { transform: translateY(-2px); }
    100% { transform: translateY(0); }
  }
`;

const Message = styled.p`
  text-align: center;
  color: ${(props) => (props.error ? 'red' : 'green')};
`;

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const userId = localStorage.getItem("Id");
      const response = await axios.put(`http://localhost:8000/user/${userId}/change-password`, {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        setMessage("Password changed successfully.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <MainDashboard>
      <FormContainer>
        <Title>Change Password</Title>
        <Form onSubmit={handleChangePassword}>
          <InputContainer>
            <Label>Current Password:</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <Label>New Password:</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <Label>Confirm New Password:</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputContainer>
          <Button type="submit">Change Password</Button>
        </Form>
        {message && <Message error={message.includes("error")}>{message}</Message>}
      </FormContainer>
    </MainDashboard>
  );
};

export default ChangePassword;