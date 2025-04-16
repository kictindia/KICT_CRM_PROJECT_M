import React, { useEffect, useState } from 'react';
import { useSprings, animated, useSpring } from 'react-spring';
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
`;

const CourseCard = styled(animated.div)`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  width: 200px;
  height: fit-content;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CourseTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
`;

const CourseDescription = styled.p`
  font-size: 16px;
  color: #555;
  margin: 5px 0;
  line-height: 1.5;
`;

const FeeSection = styled.div`
  margin: 15px 0;
  color: #001f3d;
  font-weight: bold;
  font-size: 18px;
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



const Title = styled.h2`
  color: #001f3d;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 24px;
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

// Modal Content Styling with animated spring
const ModalContent = styled(animated.div)`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform-origin: center;
  transition: all 0.3s ease-in-out;
  &::-webkit-scrollbar {
    width: 5px;
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

// Close button for the modal
const CloseButton = styled.button`
  background-color: #001f3d;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  display: block;
  margin-left: auto ;

  &:hover {
    background-color: #e04e4e;
  }
`;

// Label for each form field in modal
const Label = styled.label`
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  display: block;
`;

const Heading = styled.div`
  width: 100%;
  background: linear-gradient(270deg, #001f3d 0%, #0066cc 100%);
  color: white;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin-bottom: 40px;
  font-size: 16px;
  @media (max-width: 480px) {
    width: 100%;
  }
`;
// Input fields for modal (both text and number fields)

const Input = styled.input`
  width: 96%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #001f3d;
    box-shadow: 0 0 5px rgba(255, 88, 107, 0.3);
  }
`;
const Hr = styled.hr`
  margin: 20px 0;
  border-color: #ddd;
  width: 100%;
`;
// Update Installments Inputs
const InstallmentInputContainer = styled.div`
  margin-bottom: 10px;
`;

const InstallmentInput = styled(Input)`
  margin-bottom: 8px;
`;

// Button for submitting the fee update
const UpdateButton = styled.button`
  background-color: #001f3d;
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 75%;
  margin-top: 10px;
  font-size: 16px;
  
  &:hover {
    background-color: #0066cc;
  }
`;
const AddInstallmentButton = styled.button`
  background-color: #001f3d;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0066cc;
  }
`;
const EnrollCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newPlans, setNewPlans] = useState([]);

  // Fetch and display courses filtered by FranchiseId
  const fetchEnrolledCourses = async () => {
    try {
      // Retrieve FranchiseId from localStorage
      const franchiseData = JSON.parse(localStorage.getItem('FranchiseData'));
      const franchiseId = franchiseData ? franchiseData.FranchiseID : null;

      if (!franchiseId) {
        console.log('FranchiseId not found in localStorage');
        return;
      }

      // Fetch all course-franchise data
      const response = await fetch(`http://localhost:8000/course-franchise/get/${franchiseId}`);
      const data = await response.json();

      // Filter courses by FranchiseId
      // const filteredCourses = data.filter(course => course.FranchiseId === franchiseId);

      setCourses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // Use react-spring for animation
  // const springs = useSprings(
  //     courses.length,
  //     courses.map(() => ({
  //         opacity: 1,
  //         transform: 'translateY(0)',
  //         from: { opacity: 0, transform: 'translateY(20px)' },
  //     }))
  // );


  const openModal = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
    setNewPlans(course.Price.Plans || []);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
    setNewPlans([]);
  };

  // Handle individual installment changes
  const handleInstallmentChange = (index, value, installmentIndex) => {
    const updatedPlans = [...newPlans];
    updatedPlans[index].Installment[installmentIndex] = value;
    setNewPlans(updatedPlans);
  };

  // Add new installment input field
  const addInstallmentInput = (index) => {
    const updatedPlans = [...newPlans];
    updatedPlans[index].Installment.push(''); // Add empty string for new input
    setNewPlans(updatedPlans);
  };

  const modalSpring = useSpring({
    opacity: modalOpen ? 1 : 0,
    transform: modalOpen ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 200, friction: 15 },
  });
  // Handle fee update
  const handleUpdateFee = async () => {
    try {
      if (!newPlans || newPlans.length === 0) {
        alert('Please provide valid plans.');
        return;
      }

      // Remove _id and CourseId from the updated course data
      const { _id, CourseId, ...updatedCourse } = selectedCourse;

      // Include only necessary fields in the update payload
      const updatedCourseData = {
        ...updatedCourse,
        Price: {
          ...updatedCourse.Price,
          Plans: newPlans,
        },
      };

      var fran = localStorage.getItem("Id");
      // Update the course data on the backend
      const response = await fetch(`http://localhost:8000/course-franchise/update/${fran}/${CourseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCourseData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        alert('Fee updated successfully!');
        fetchEnrolledCourses();

        // setCourses((prevCourses) =>
        //   prevCourses.map((course) =>
        //     course.CourseId === CourseId ? { ...course, ...updatedCourseData } : course
        //   )
        // );
        closeModal();
      } else {
        const errorData = await response.json();
        alert(`Error updating fee: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating fee:', error);
      alert('Error updating fee.');
    }
  };


  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...newPlans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    setNewPlans(updatedPlans);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainDashboard>
      <Title>Enrolled Courses</Title>
      <CourseContainer>
        {courses?.CourseData?.length === 0 ? (
          <p>No courses available for this franchise.</p>
        ) : (
          courses?.CourseData?.map((courseItem, index) => (
            <CourseCard key={index}>
              <ul style={{listStyle:"none"}}>
                <li key={courseItem.CourseId}>
                  <CourseTitle>{courseItem.CourseName}</CourseTitle>
                  <CourseDescription>{courseItem.CourseDescription}</CourseDescription>
                  <FeeSection>
                    <p><strong>Base Fee:</strong> ₹{courseItem.Price.BaseFee}</p>
                  </FeeSection>
                  {courseItem.Price.Plans && courseItem.Price.Plans.length > 0 && (
                    <PlansSection>
                      {courseItem.Price.Plans.map((plan, index) => (
                        <PlanItem key={index}>
                          <strong>{plan.PlanName}</strong>
                          <span>Total Fee: ₹{plan.TotalFee}</span><br />
                          <span>Installments: {plan.Installment.join(', ')}</span>
                        </PlanItem>
                      ))}
                    </PlansSection>
                  )}
                  <UpdateButton onClick={() => openModal(courseItem)}>Update Fees</UpdateButton>
                </li>
              </ul>
            </CourseCard>
          ))
        )}
      </CourseContainer>

      {/* Modal to update fee */}
      {modalOpen && selectedCourse && (
        <ModalBackdrop onClick={closeModal}>
          <ModalContent style={modalSpring} onClick={(e) => e.stopPropagation()}>
            <Title>Update Fee for {selectedCourse.CourseName}</Title>

            {newPlans.map((plan, index) => (
              <div key={index}>
                <Heading>Plan Name: {plan.PlanName}</Heading>

                <Label>New Total Fee</Label>
                <Input
                  type="number"
                  value={plan.TotalFee}
                  onChange={(e) => handlePlanChange(index, 'TotalFee', e.target.value)}
                  min="0"
                />

                <Label>New Installments</Label>
                {/* Render each installment as an individual input field */}
                {plan.Installment.map((installment, installmentIndex) => (
                  <InstallmentInputContainer key={installmentIndex}>
                    <Label>Installment {installmentIndex + 1}</Label>
                    <InstallmentInput
                      type="number"
                      value={installment}
                      onChange={(e) =>
                        handleInstallmentChange(index, e.target.value, installmentIndex)
                      }
                    />
                  </InstallmentInputContainer>
                ))}


                <Hr />
              </div>
            ))}

            <UpdateButton onClick={handleUpdateFee}>Update Fee</UpdateButton>
            <CloseButton onClick={closeModal}>Close</CloseButton>
          </ModalContent>
        </ModalBackdrop>
      )}

    </MainDashboard>
  );
};

export default EnrollCourses;