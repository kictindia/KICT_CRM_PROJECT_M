import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logoimgage from "../assets/logo.png";
import LoginImage from "../assets/LoginPage.jpg";
import mile from "../assets/logo.png";
import { Label } from "./Styles/GlobalStyles";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // For "Remember Me" checkbox state
  const [loginSuccess, setLoginSuccess] = useState(false); // To manage success message visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the credentials exist in localStorage and set the states
    const savedId = localStorage.getItem("Id");
    const savedPassword = localStorage.getItem("Password");

    if (savedId && savedPassword) {
      setId(savedId);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://franchiseapi.kictindia.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: id, Password: password }),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok) {
        if (!data.Data || !data.Data.Role) {
          console.error("Missing required data in the response:", data);
          alert("An error occurred. Required information is missing.");
          return;
        }

        // Store the credentials in localStorage regardless of "Remember Me"
        localStorage.setItem("Id", id);
        localStorage.setItem("Password", password);

        // Store the role in localStorage
        localStorage.setItem("Role", data.Data.Role.trim());


        // Fetch and store specific data for each role (Student, Teacher, Admin, Franchise)
        if (data.Data.Role === "Student" && !localStorage.getItem("StudentData")) {
          const studentId = localStorage.getItem("Id");
          const studentResponse = await fetch(`https://franchiseapi.kictindia.com/student/get/${studentId}`);
          const studentData = await studentResponse.json();
          if (studentResponse.ok) {
            localStorage.setItem("StudentData", JSON.stringify(studentData));
          } else {
            console.error("Failed to fetch student data");
          }
        } else if (data.Data.Role === "Teacher" && !localStorage.getItem("TeacherData")) {
          const teacherId = localStorage.getItem("Id");
          const teacherResponse = await fetch(`https://franchiseapi.kictindia.com/teacher/get/${teacherId}`);
          const teacherData = await teacherResponse.json();
          console.log(teacherData)
          if (teacherResponse.ok) {
            localStorage.setItem("TeacherData", JSON.stringify(teacherData));
          } else {
            console.error("Failed to fetch teacher data");
          }
        } else if (data.Data.Role === "Admin" && !localStorage.getItem("AdminData")) {
          const adminId = localStorage.getItem("Id");
          const adminResponse = await fetch(`https://franchiseapi.kictindia.com/admin/get/${adminId}`);
          const adminData = await adminResponse.json();
          if (adminResponse.ok) {
            localStorage.setItem("AdminData", JSON.stringify(adminData));
          } else {
            console.error("Failed to fetch admin data");
          }
        } else if (data.Data.Role === "Franchise" && !localStorage.getItem("FranchiseData")) {
          const franchiseId = localStorage.getItem("Id");
          const franchiseResponse = await fetch(`https://franchiseapi.kictindia.com/franchise/get/${franchiseId}`);
          const franchiseData = await franchiseResponse.json();
          if (franchiseResponse.ok) {
            localStorage.setItem("FranchiseData", JSON.stringify(franchiseData));
          } else {
            console.error("Failed to fetch franchise data");
          }
        }

        // Show success message
        setLoginSuccess(true);

        // After 2 seconds, navigate to the correct page based on the role
        setTimeout(() => {
          switch (data.Data.Role.trim()) {
            case "Student":
              navigate("/student/dashboard");
              break;
            case "Teacher":
              navigate("/teacher/dashboard");
              break;
            case "Admin":
              navigate("/admin/dashboard");
              break;
            case "Franchise":
              navigate("/branch/dashboard");
              break;
            default:
              alert("Role not recognized");
          }
        }, 2000); // 2-second delay
      } else {
        console.error("Login failed:", data.message);
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LoginRight>
          <Top>
            <img src={mile} height="60px" alt="logo" />
          </Top>
          <FlexBox>
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <HeadData>Login</HeadData>
              <p style={{ fontSize: "14px", color: "#A8A8A8" }}>
                Sign In To Your Account
              </p>
            </div>

            <FormContainer>
              <InputGroup2>
                <StyledInput
                  type="text"
                  placeholder="User Name"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                />
              </InputGroup2>
              <InputGroup2>
                <StyledInput
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                />
              </InputGroup2>
              <InputGroup2>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <Label>Remember Me</Label>
              </InputGroup2>
            </FormContainer>

            <LoginButton onClick={handleLogin} disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </LoginButton>

            {/* Display success message */}
            {loginSuccess && (
              <SuccessMessage>
                Login Successful! Redirecting...
              </SuccessMessage>
            )}
          </FlexBox>
        </LoginRight>
        <LoginLeft>
          <img src={LoginImage} width="100%" height="100%" alt="Logo" />
        </LoginLeft>
      </LoginBox>
    </LoginContainer>
  );
};

// Styled components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-color: #f0f2f5;
`;

const LoginBox = styled.div`
  display: flex;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
  }
`;

const LoginLeft = styled.div`
  background: linear-gradient(234deg, #222d78 6%, #7130e4 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100vh;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginRight = styled.div`
  background-color: #fff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  width: 30%;
  align-items: center;

  @media (max-width: 768px) {
    width: auto;
    padding: 20px;
  }
`;

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: -100px;
  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const HeadData = styled.h2`
  font-size: 32px;
  font-weight: 600;
  text-align: left;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 60px;
  font-size: 40px;
  color: #222d78;
`;

const LoginButton = styled.button`
  width: 70%;
  padding: .8rem;
  background-color: #7130e4;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a24b4;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const InputGroup2 = styled.div`
  margin-bottom: 20px;
  position: relative;
  display: flex;
  gap: 5px;
`;

const StyledInput = styled.input`
  box-sizing: border-box;
  border: 1px solid #b6b6b6;
  padding: 12px 20px;
  width: 100%;
  border-radius: 10px;
  font-size: 1rem;
  color: #333;

  &:focus {
    outline: none;
    border: 2px solid #7130e4;
  }

  &::placeholder {
    color: #999;
  }
`;

const SuccessMessage = styled.div`
  margin-top: 20px;
  color: green;
  font-weight: bold;
  font-size: 16px;
`;

export default Login;
