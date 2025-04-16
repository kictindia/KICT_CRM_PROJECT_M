import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled components for card and text
const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 250px;
  padding: 20px;
  /* text-align: center; */
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  margin-left: 30px;
  color: #333;
`;

const CardText = styled.p`
  font-size: 14px;
  color: #555;
  border: 1px solid black;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
`;

const CardDateTime = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: #000;
  margin: 5px 0;
`;

const FollowUpPage = ({ Id }) => {
  const [followUpData, setFollowUpData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(Id)
    setLoading(true)
    // Fetching data from the API
    axios.get(`http://localhost:8000/followups/getById/${Id}`)  // Replace with your actual API URL
      .then(response => {
        setFollowUpData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        console.log(Id)
      });
    setLoading(false)
  }, [Id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CardContainer>
      {followUpData.map((followUp, index) => (
        <Card key={followUp._id}>
          <div style={{display:"flex", gap:"10px"}} >
            <CardText>{index + 1}</CardText>
            <CardDateTime>{followUp.Date} - {followUp.Time}</CardDateTime>
          </div>
          <CardTitle>{followUp.Message}</CardTitle>
        </Card>
      ))}
    </CardContainer>
  );
};

export default FollowUpPage;
