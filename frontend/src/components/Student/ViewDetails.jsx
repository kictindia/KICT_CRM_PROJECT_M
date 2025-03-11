import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to access the URL parameter
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 40%;
  @media(max-width:480px){
    width: 90%;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  color: #333;
`;

const CourseInfo = styled.p`
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
`;

const SectionTitle = styled.h5`
  font-size: 20px;
  color: #333;
  margin-top: 20px;
  border-bottom: 2px solid #ccc;
  padding-bottom: 5px;
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const ListItem = styled.li`
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
`;

const ContentLink = styled.a`
  color: #688af6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const MainDashboard = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding: 20px;
  width:  -webkit-fill-available;
  background-color: #f9f9f9;
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

const ViewDetails = () => {
    const [courseDetails, setCourseDetails] = useState(null);
    const { courseId } = useParams(); // Get courseId from the URL parameter

    // Fetch course details when the page loads
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`https://franchiseapi.kictindia.com/course/get/${courseId}`);
                setCourseDetails(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        if (courseId) {
            fetchCourseDetails();
        }
    }, [courseId]);

    return (
        <MainDashboard>

            <Container>
                {courseDetails ? (
                    <div>
                        {/* Course Header */}
                        <Title>{courseDetails.CourseName}</Title>
                        <CourseInfo><strong>Description:</strong> {courseDetails.CourseDescription}</CourseInfo>
                        <CourseInfo><strong>Duration:</strong> {courseDetails.CourseDuration}</CourseInfo>
                        <CourseInfo><strong>Category:</strong> {courseDetails.Category}</CourseInfo>

                        {/* Syllabus Section */}
                        <SectionTitle>Syllabus:</SectionTitle>
                        {courseDetails.Syllabus.length > 0 ? (
                            <List>
                                {courseDetails.Syllabus.map((syllabus, idx) => (
                                    <ListItem key={idx}>
                                        {syllabus.Title ? syllabus.Title : 'No Title Available'}:
                                        <ul>
                                            {syllabus.Topics.length > 0 ? (
                                                syllabus.Topics.map((topic, tIdx) => (
                                                    <ListItem key={tIdx}>{topic}</ListItem>
                                                ))
                                            ) : (
                                                <ListItem>No Topics Available</ListItem>
                                            )}
                                        </ul>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <p>No syllabus available for this course.</p>
                        )}

                        {/* Content Section */}
                        <SectionTitle>Content:</SectionTitle>
                        {courseDetails.Content.length > 0 ? (
                            <List>
                                {courseDetails.Content.map((content, idx) => (
                                    <ListItem key={idx}>
                                        <strong>{content.Title ? content.Title : 'No Title Available'}:</strong>
                                        <ul>
                                            {content.Topics.length > 0 ? (
                                                content.Topics.map((topic, tIdx) => (
                                                    <ListItem key={tIdx}>
                                                        {topic.TopicName ? topic.TopicName : 'No Topic Name Available'}{' '}
                                                        {topic.VideoLink && (
                                                            <ContentLink href={topic.VideoLink} target="_blank" rel="noopener noreferrer">
                                                                Watch Video
                                                            </ContentLink>
                                                        )}
                                                    </ListItem>
                                                ))
                                            ) : (
                                                <ListItem>No Content Available</ListItem>
                                            )}
                                        </ul>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <p>No content available for this course.</p>
                        )}
                    </div>
                ) : (
                    <p>Loading course details...</p>
                )}
            </Container>
        </MainDashboard>
    );
};

export default ViewDetails;
