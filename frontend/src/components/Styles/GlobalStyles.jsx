import styled from 'styled-components';

export const SubmitButton = styled.button`
width: 320px;
padding: 10px;
background: #12192c; /* Initial background */
color: white; /* Initial text color */
font-size: 16px;
cursor: pointer;
font-weight: bold;
border: none;
border-radius: 30px;
transition: all 0.3s ease; /* Smooth transition for all changes */
margin-top: 20px;

&:hover {
  background: white; /* Background turns white on hover */
  color: #12192c; /* Text turns dark blue */
  border: 2px solid #12192c; /* Adds dark blue border on hover */
  animation: bounce 0.5s ease-out; /* Bounce effect on hover */
}

@media(max-width: 480px){
  width: 80%; /* Button width adjustment for small screens */
}

/* Keyframes for bounce animation */
@keyframes bounce {
  0% {
    transform: translateY(0); /* Starting position */
  }
  30% {
    transform: translateY(-5px); /* Move up */
  }
  50% {
    transform: translateY(0); /* Back to normal position */
  }
  70% {
    transform: translateY(-2px); /* Move up slightly */
  }
  100% {
    transform: translateY(0); /* Final position */
  }
}
`;

export const SubmitButton1 = styled.button`
width: 80px;
padding: 8px;
background: #12192c; /* Initial background */
color: white; /* Initial text color */
font-size: 12px;
cursor: pointer;
font-weight: bold;
border: none;
border-radius: 30px;
transition: all 0.3s ease; /* Smooth transition for all changes */
margin-top: 20px;

&:hover {
  background: white; /* Background turns white on hover */
  color: #12192c; /* Text turns dark blue */
  border: 2px solid #12192c; /* Adds dark blue border on hover */
  animation: bounce 0.5s ease-out; /* Bounce effect on hover */
}

@media(max-width: 480px){
  width: 80px; /* Button width adjustment for small screens */
}

/* Keyframes for bounce animation */
@keyframes bounce {
  0% {
    transform: translateY(0); /* Starting position */
  }
  30% {
    transform: translateY(-5px); /* Move up */
  }
  50% {
    transform: translateY(0); /* Back to normal position */
  }
  70% {
    transform: translateY(-2px); /* Move up slightly */
  }
  100% {
    transform: translateY(0); /* Final position */
  }
}
`;


export const MainDashboard = styled.div`
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

export const Input = styled.input`
width: 87%;
padding: 10px 20px;
border: 1px solid #001f3d;
border-radius: 5px;
@media (max-width:480px){
  width: 83%;
}
`;

export const Input1 = styled.input`
width: 80%;
padding: 10px 20px;
border: 1px solid #001f3d;
border-radius: 5px;
@media (max-width:480px){
  width: 83%;
}
`;
export const Input2 = styled.input`
width: 90%;
padding: 10px 20px;
border: 1px solid #001f3d;
border-radius: 5px;
@media (max-width:480px){
  width: 83%;
}
`;

export const Main = styled.div`
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 20px;
@media (max-width:480px){
  grid-template-columns: repeat(1, 1fr);
}
`;

export const Main1 = styled.div`
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 20px;
@media (max-width: 480px){
  grid-template-columns: repeat(1, 1fr);
}
`;
export const Heading = styled.div`
  width: 30%;
  background: #ffffff; /* White background for simplicity */
  color: #000000; /* Dark grey text */
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 700; /* Slightly bolder text for readability */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  border: 2px solid #0066cc; /* Blue border for subtle highlight */
  transition: all 0.3s ease; /* Smooth transition on hover */
  position: relative; /* Required for positioning pseudo-elements */

  &:hover {
    background: #f4f8ff; /* Light blue background on hover */
    color: #000000; /* Change text to blue on hover */
    box-shadow: 0 6px 16px rgba(0, 102, 204, 0.3); /* Stronger shadow on hover */
    border-color: #004a99; /* Darker blue border on hover */
    transform: scale(1.05); /* Slightly scale the element */
  }

  &:hover::after {
    content: '';
    position: absolute;
    bottom: -10px; /* Position below the element */
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 5px;
    background-color: #0066cc; /* Color of the after effect */
    border-radius: 5px;
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    width: 100%; /* Full width on smaller screens */
  }
`;

export const Select1 = styled.select`
width: 100%;
padding: 10px 20px;
border: 1px solid #001f3d;
border-radius: 5px;
@media (max-width: 480px) {
 height: 38px;
 width: 100%;
 font-size: 12px;
 padding: 10px 12px;
}
`;

export const Option = styled.option`
font-size: 16px;
color: #7a7a7a;
background-color: #f4f6fc;
font-weight: bold;
padding: 10px 15px;
border: 2px solid #001f3d;
border-radius: 30px;

/* Optional: add a hover effect */
&:hover {
  background-color: #001f3d;
  color: white;
}
`;

export const Label = styled.span`
font-size: 12px;
`;

export const InputContainer = styled.div`
position: relative;
width: 100%;
margin-bottom: 20px;
gap: 10px;
display: flex;
flex-direction: column;
`;

export const FormContainer = styled.div`
background-color: white;
padding: 20px;
width: 95%;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
@media(max-width:768px){
  width: 100%;
}
@media(max-width:480px){
  width:-webkit-fill-available;
}
`;

export const Title = styled.h2`
color: #001f3d;
text-align: center;
margin-bottom: 30px;
font-weight: bold;
font-size: 20px;
`;

export const Section = styled.div`
display: flex;
justify-content: space-between;
`;

export const Form = styled.form`
width: 100%;
max-width: 1200px;
margin: 0 auto;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px ;
  margin: 8px;
  gap: 2px;
`;

export const Section1 = styled.div`
display: flex;
justify-content: space-between;
`;

export const Section2 = styled.div`
display: flex;
gap: 1rem;
`;

export const Label1 = styled.span`
  font-size: 12px;
  font-weight: bold;
`