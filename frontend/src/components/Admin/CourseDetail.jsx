import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';

// Keyframe for fade-in effect
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Keyframe for card hover effect
const cardHover = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

// Styled Components
const CourseDetailsContainer = styled.div`
  flex: 1;
  padding: 20px;
  width: -webkit-fill-available;
  background-color: #f9f9f9;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  margin: 0 auto;
  animation: ${fadeIn} 1s ease-out;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Title = styled.h2`
  color: #001f3d;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 28px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Section = styled.section`
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 1s ease-out;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const SubTitle = styled.h3`
  color: #333;
  font-size: 22px;
  margin-bottom: 15px;
  text-decoration: underline;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Para = styled.p`
font-weight: 700;
font-size: 16px;
`;

const ListItem = styled.li`
  margin: 10px 0;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PricingList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
`;

const PricingItem = styled.li`
  font-size: 16px;
  margin: 10px 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Installment = styled.span`
  color: #001f3d;
  font-weight: bold;
`;

const VideoLink = styled.a`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const VideoContainer = styled.div`
  margin-top: 20px;
  display: ${(props) => (props.showVideo ? 'block' : 'none')};
  text-align: center;

  iframe {
    width: 100%;
    height: 400px;
    border: none;
    border-radius: 8px;
  }
`;

// Hover animation for cards
const CourseCard = styled.div`
  transition: all 0.3s ease;
  &:hover {
    animation: ${cardHover} 0.3s forwards;
  }
`;



const CourseDetails = () => {
  const { courseId } = useParams(); // Get CourseId from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLink, setVideoLink] = useState('');

  useEffect(() => {
    // Fetch course details by courseId
    axios
      .get(`https://franchiseapi.kictindia.com/course/get/${courseId}`)
      .then((response) => {
        setCourse(response.data); // Set the fetched course data
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching course details:', err);
        setError('Failed to fetch course details.');
        setLoading(false);
      });
  }, [courseId]);
  useEffect(() => {
    // Fetch course details by courseId
    axios
      .get(`https://franchiseapi.kictindia.com/course/get/${courseId}`)
      .then((response) => {
        setCourse(response.data); // Set the fetched course data
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching course details:', err);
        setError('Failed to fetch course details.');
        setLoading(false);
      });
  }, [courseId]);

  const handleVideoClick = (videoLink) => {
    setShowVideo(true);
    setVideoLink(videoLink);
  };

  if (loading) {
    return <div>Loading course details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <MainDashboard>
      <CourseDetailsContainer>
        <Title>Course Details: {course.CourseName}</Title>

        {/* Course Information */}
        <Section>
          <SubTitle>Course Information</SubTitle>
          <List>
            <ListItem><strong>Course Name:</strong> {course.CourseName}</ListItem>
            <ListItem><strong>Course ID:</strong> {course.CourseId}</ListItem>
            <ListItem><strong>Category:</strong> {course.Category}</ListItem>
            <ListItem><strong>Duration:</strong> {course.CourseDuration}</ListItem>
            <ListItem><strong>Description:</strong> {course.CourseDescription}</ListItem>
          </List>
        </Section>

        {/* Syllabus */}
        <Section>
          <SubTitle>Syllabus</SubTitle>
          {course.Syllabus.map((chapter) => (
            <div key={chapter._id}>
              <Para>{chapter.Title}</Para>
              <List>
                {chapter.Topics.map((topic, index) => (
                  <ListItem key={index}>{topic}</ListItem>
                ))}
              </List>
            </div>
          ))}
        </Section>

        {/* Course Content */}
        <Section>
          <SubTitle>Course Content</SubTitle>
          {course.Content.map((chapter) => (
            <div key={chapter._id}>
              <Para>{chapter.Title}</Para>
              <List>
                {chapter.Topics.map((topic) => (
                  <ListItem key={topic.TopicName} >
                    <Para>{topic.TopicName}: </Para>
                    <VideoLink
                      href={topic.VideoLink}
                      target="_blank"
                    // onClick={(e) => {
                    //     e.preventDefault();
                    //     handleVideoClick(topic.VideoLink);
                    // }}
                    >
                      Watch Video
                    </VideoLink>
                  </ListItem>
                ))}
              </List>
            </div>
          ))}
        </Section>


        {/* Pricing Plans */}
        <Section>
          <SubTitle>Pricing Plans</SubTitle>
          <List>
            <ListItem><Para>Base Fee:</Para> Rs.{course.Price.BaseFee}</ListItem>
          </List>
          <PricingList>
            {course.Price.Plans.map((plan) => (
              <PricingItem key={plan._id}>
                <Para>{plan.PlanName} Plan:</Para> Rs.{plan.TotalFee}
                <div>Installments: {plan.Installment.map((amount, index) => (
                  <Installment key={index}>Rs.{amount} </Installment>
                ))}</div>
              </PricingItem>
            ))}
          </PricingList>
        </Section>

        {/* Video Embedding */}
        <VideoContainer showVideo={showVideo}>
          <iframe
            src={videoLink}
            title="Course Video"
            allowFullScreen
          />
        </VideoContainer>
      </CourseDetailsContainer>
    </MainDashboard>
  );
};

export default CourseDetails;
