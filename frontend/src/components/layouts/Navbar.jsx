import React from "react";
import styled from "styled-components";
import logo from "../../assets/3135715.png";
import clogo from "../../assets/logo.png";
import { Award } from "lucide-react"; // Import the Award icon from lucide-react
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Styled Components for the Header
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f1f1f1;
  padding: 10px 20px;
  height: 60px;
  box-sizing: border-box;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 1);

  @media (max-width:480px){
    justify-content: space-around;
  }
`;

const Logo = styled.div`
  height: 40px;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  @media (max-width:480px){
    height: 30px;

    img{
      height: 100%;
      width: 100%;
    }
  }
`;

const InstituteSection = styled.div`
  display: flex;
  align-items: center;
`;

const InstituteName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;

const CertificateButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-right: 20px;
  display: flex;
  align-items: center;

  svg {
    height: 30px; /* Adjust the icon size as per your requirement */
    width: auto;
    color: #fff;  /* Set icon color to white */
  }

  &:hover {
    opacity: 0.8;
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  margin-left: 20px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Navbar = () => {
  const navigate = useNavigate(); 
  const role = localStorage.getItem("Role"); 

  const navigateToCertificate = () => {
    navigate("/student/certificate");
  };

  return (
    <HeaderContainer>
      <Logo>
        <img src={clogo} alt="Logo" />
      </Logo>
      <InstituteSection>
        {role === "Student" && (
          <CertificateButton onClick={navigateToCertificate}>
            <Award fontSize={16} color="black" />
            <span style={{ marginLeft: "8px", color: "#000", fontSize: "16px" }}>
              Certificate
            </span>
          </CertificateButton>
        )}
        <InstituteName>
          <ProfileImage style={{ height: "45px" }} src={logo} alt="School-Logo" />
        </InstituteName>
      </InstituteSection>
    </HeaderContainer>
  );
};

export default Navbar;
