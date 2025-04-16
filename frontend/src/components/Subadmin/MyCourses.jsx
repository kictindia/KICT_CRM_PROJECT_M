import React, { useEffect, useState } from 'react';
import { useSprings, animated } from 'react-spring';
import styled from 'styled-components';

// Styled components for course card container and elements
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


const CourseContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

const CourseCard = styled(animated.div)`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  width: 250px;
  height: fit-content;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  p{
    font-size: 14px;
  }
`;

const CourseTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const PlansSection = styled.div`
  margin-top: 10px;
  color: #444;
  text-align: left;
`;

const PlanItem = styled.div`
  margin: 10px 0;
  padding: 5px 0;
  border-top: 1px solid #ddd;
  color: #555;

  &:first-child {
    border-top: none;
  }

  & > strong {
    display: block;
    font-size: 16px;
    margin-bottom: 5px;
  }

  & > span {
    font-size: 14px;
  }
`;

const CourseDescription = styled.p`
  font-size: 16px;
  color: #555;
  margin: 5px 0;
`;

const EnrollButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center; 
  margin-top: 20px;
  align-items: center;
`;


const Title = styled.h2`
  color: #001f3d;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 20px;
`;

// Modal Styles
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;

  h3 {
    font-size: 24px;
    margin-bottom: 15px;
    color: #333;
  }

  p {
    font-size: 16px;
    color: #555;
    line-height: 1.5;
    margin: 10px 0;
  }

  h4 {
    font-size: 20px;
    color: #333;
    margin-top: 20px;
  }

  ul {
    list-style-type: none;
    padding-left: 20px;
  }

  li {
    font-size: 16px;
    color: #555;
    margin-bottom: 8px;
  }

  ul ul {
    padding-left: 20px;
  }

  li strong {
    font-weight: bold;
    font-size: 18px;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background-color: #001f3d;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  display: block;
  margin-left: auto;

  &:hover {
    background-color: #e04e4e;
  }
`;

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null); // To track selected course for the modal
  const [modalOpen, setModalOpen] = useState(false); // To control modal visibility
  const [addedCourses, setAddedCourses] = useState([]); // To track added courses (IDs or unique identifiers)

  // Fetch courses data from the API
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8000/course/all');
      const data = await response.json();
      var Id = localStorage.getItem("Id");
      var franData = JSON.parse(localStorage.getItem("FranchiseData"))
      var filterData = data.filter(data => (data.FranchiseId == Id || data.FranchiseId == "All" || data.State == franData.State))
      console.log(filterData)
      console.log(franData.State)

      // const response1 = await fetch(`http://localhost:8000/course-franchise/get/${localStorage.getItem('Id')}`);
      // const data1 = await response1.json();
      // var addedCoursesFromStorage = data1?.CourseData?.map(val => val.CourseId);
      // setAddedCourses(addedCoursesFromStorage)


      // Fetch the added courses (that are already added to the franchise)
      // const addedCoursesFromStorage = JSON.parse(localStorage.getItem('addedCourses')) || [];

      // Filter out courses that are already added to the franchise
      // const filteredCourses = data.filter(course => !addedCoursesFromStorage?.includes(course.CourseId));

      setCourses(data); // Set the filtered courses data
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false); // Set loading to false if there's an error
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);


  // Handle animation using useSprings to animate multiple cards
  const springs = useSprings(
    courses.length,
    courses.map(() => ({
      opacity: 1,
      transform: 'translateY(0)',
      from: { opacity: 0, transform: 'translateY(20px)' },
    }))
  );

  const openModal = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddToMyCourses = async (course) => {
    try {
      const franchiseData = JSON.parse(localStorage.getItem('FranchiseData'));
      const franchiseName = franchiseData ? franchiseData.FranchiseName : 'Unknown Franchise';
      const franchiseId = franchiseData ? franchiseData.FranchiseID : 'Unknown ID';

      // Check if course is already added
      if (addedCourses?.includes(course._id)) {
        alert('Course already added to your franchise!');
        return; // Exit the function if already added
      }

      // Create the CourseData object following the required format
      const courseData = [{
        CourseId: course.CourseId,
        CourseName: course.CourseName,
        CourseDuration: course.CourseDuration,
        Price: {
          BaseFee: course.Price.BaseFee,
          Plans: course.Price.Plans.map(plan => ({
            PlanName: plan.PlanName,
            TotalFee: plan.TotalFee,
            Installment: plan.Installment
          }))
        }
      }];

      // Create the request body with franchise and course data
      const courseWithFranchise = {
        FranchiseId: franchiseId,
        FranchiseName: franchiseName,
        CourseData: courseData,
      };

      // Send the request to the backend to add the course
      const response = await fetch('http://localhost:8000/course-franchise/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseWithFranchise),
      });

      if (response.ok) {
        alert('Course added successfully!');

        // Update the added courses list by adding the current course
        // setAddedCourses((prev) => [...prev, course._id]);

        // Save updated added courses list to localStorage
        // localStorage.setItem('addedCourses', JSON.stringify([...addedCourses, course._id]));
        fetchCourses();

        // Remove the added course from the available list
        // setCourses((prevCourses) => prevCourses.filter(item => item._id !== course._id));
      } else {
        alert('Error adding course.');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Error adding course.');
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainDashboard>
      <Title>My Courses</Title>
      <CourseContainer>
        {courses.map((course, index) => (
          <CourseCard key={course._id} style={springs[index]}>
            <CourseTitle>{course.CourseName}</CourseTitle>
            <CourseDescription>{course.CourseDescription}</CourseDescription>
            <p><strong>Duration:</strong> {course.CourseDuration}</p>
            <p><strong>Category:</strong> {course.Category}</p>
            <p><strong>Base Fee:</strong> ₹{course.Price.BaseFee}</p>
            {course.Price.Plans && course.Price.Plans.length > 0 && (
              <PlansSection>
                {course.Price.Plans.map((plan, index) => (
                  <PlanItem key={index}>
                    <strong>{plan.PlanName}</strong>
                    <span>Total Fee: ₹{plan.TotalFee}</span><br />
                    <span>Installments: {plan.Installment.join(', ')}</span>
                  </PlanItem>
                ))}
              </PlansSection>
            )}
            {/* <ButtonContainer>
              <EnrollButton onClick={() => openModal(course)}>View</EnrollButton>

              {addedCourses?.includes(course.CourseId) ? "Already Added" :
                <EnrollButton
                  onClick={() => handleAddToMyCourses(course)}
                  disabled={addedCourses?.includes(course.CourseId)}
                >
                  Add to My Course
                </EnrollButton>
              }
            </ButtonContainer> */}
          </CourseCard>
        ))}
      </CourseContainer>

      {/* Modal */}
      {modalOpen && (
        <ModalBackdrop onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{selectedCourse.CourseName}</h3>
            <p><strong>Category:</strong> {selectedCourse.Category}</p>
            <p><strong>Duration:</strong> {selectedCourse.CourseDuration}</p>
            <p><strong>Base Fee:</strong> ₹{selectedCourse.Price.BaseFee}</p>
            <h4>Course Syllabus:</h4>
            <ul>
              {selectedCourse.Syllabus.map((module) => (
                <li key={module._id}>
                  <strong>{module.Title}</strong>
                  <ul>
                    {module.Topics.map((topic, idx) => (
                      <li key={idx}>{topic}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <CloseButton onClick={closeModal}>Close</CloseButton>
          </ModalContent>
        </ModalBackdrop>
      )}
    </MainDashboard>
  );
};

export default MyCourses;
