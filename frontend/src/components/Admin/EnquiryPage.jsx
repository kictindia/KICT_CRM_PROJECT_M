import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import FollowUp from "../Admin/FollowUpPageCard";

const MainDashboard = styled.div`
  flex: 1;
  padding: 20px;
  width: -webkit-fill-available;
  background-color: #f9f9f9;
  box-sizing: border-box;
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

// Styled components
const Container = styled.div`
  /* height: 100%; */
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f7fc;
  
`;

const AdmissionLetterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  margin-top: 30px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: center;
`;

const Section = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* Three columns */
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr; /* Two columns for medium screens */
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* One column for small screens */
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #666;
  margin: 0;
`;

const Value = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0;
  font-weight: 500;
`;

const Hr = styled.hr`
  border: 0;
  border-top: 1px solid black;
  margin: 10px 0;
`;

const EnquiryPage = () => {
    const location = useLocation();
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (location.state && location.state.Id) {
            const fetchStaff = async () => {
                try {
                    console.log(location.state.Id);
                    const response = await fetch(`https://franchiseapi.kictindia.com/enquiry/get/${location.state.Id}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setStaff(data);
                } catch (error) {
                    console.error("Error fetching staff data:", error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchStaff();
        } else {
            console.error("Staff ID not provided.");
            setError("Staff ID not provided.");
            setLoading(false);
        }
    }, [location.state]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <MainDashboard>
            <Container>
                <Title>Enquiry Details</Title>
                <AdmissionLetterContainer>
                    <Section>
                        {/* First Column */}
                        <Column>
                            <Label>Enquiry No:</Label>
                            <Value>{staff?.EnquiryNo || 'Not assigned'}</Value>
                            <Hr />

                            <Label>Franchise Name:</Label>
                            <Value>{staff?.FranchiseName || 'Not assigned'}</Value>
                            <Hr />

                            <Label>Alternate Mobile No:</Label>
                            <Value>{staff?.AMobileNo || 'Not available'}</Value>
                            <Hr />

                            <Label>Address:</Label>
                            <Value>{staff?.Address || 'Not available'}</Value>
                            <Hr />

                            <Label>Joining Date:</Label>
                            <Value>{staff?.JoinDate || 'Not available'}</Value>
                            <Hr />
                        </Column>

                        {/* Second Column */}
                        <Column>
                            <Label>Date:</Label>
                            <Value>{staff?.Date || 'Not available'}</Value>
                            <Hr />

                            <Label>Name:</Label>
                            <Value>{staff?.Name || 'Not assigned'}</Value>
                            <Hr />

                            <Label>Course:</Label>
                            <Value>{staff?.Course || 'Not available'}</Value>
                            <Hr />

                            <Label>Qualification:</Label>
                            <Value>{staff?.Qualification || 'Not available'}</Value>
                            <Hr />

                            <Label>PinCode:</Label>
                            <Value>{staff?.PinCode || 'Not available'}</Value>
                            <Hr />
                        </Column>

                        {/* Third Column */}
                        <Column>
                            <Label>Remark:</Label>
                            <Value>{staff?.Remark || 'Not available'}</Value>
                            <Hr />

                            <Label>Time:</Label>
                            <Value>{staff?.Time || 'Not available'}</Value>
                            <Hr />

                            <Label>Franchise Id:</Label>
                            <Value>{staff?.FranchiseId || 'Not available'}</Value>
                            <Hr />

                            <Label>Mobile No:</Label>
                            <Value>{staff?.MobileNo || 'Not available'}</Value>
                            <Hr />

                            <Label>Know About:</Label>
                            <Value>{staff?.KnowAbout || 'Not available'}</Value>
                            <Hr />
                        </Column>
                    </Section>
                </AdmissionLetterContainer>
                <FollowUp Id={staff?.EnquiryNo} />
            </Container>
        </MainDashboard>
    );
};

export default EnquiryPage;
