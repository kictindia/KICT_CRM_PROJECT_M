import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { TbSchool } from "react-icons/tb";
import {
  BookmarkCheck,
  HandCoins,
  IndianRupeeIcon,
  KeyRound,
  LogOut,
  NotebookPen,
  School2,
  User2,
  UserRound,
  UserRoundPen,
} from "lucide-react";

const SidebarContainer = styled.div`
  box-sizing: border-box;
  position: ${(props) => (props.isMobileView ? "fixed" : "relative")};
  top: 0;
  right: ${(props) =>
    props.isMobileView && !props.isVisible ? "-250px" : "0"};
  width: ${(props) =>
    props.isMobileView ? "250px" : props.isVisible ? "250px" : "60px"};
  height: calc(100vh - 60px);
  border-left: ${(props) =>
    props.isMobileView ? "1px solid #e0e0e0" : "none"};
  border-right: ${(props) =>
    !props.isMobileView ? "1px solid #e0e0e0" : "none"};
  background-color: #fff;
  overflow-y: auto;
  transition: all 0.3s ease-in-out;
  z-index: ${(props) => (props.isMobileView ? "20" : "auto")};

  &::-webkit-scrollbar {
    width: 0px;
  }
  @media(max-width: 480px){
    height: 100vh;
  }
`;

const SidebarMenuTitle = styled.h3`
  font-size: ${(props) => (props.isVisible ? "20px" : "0px")};
  margin-bottom: ${(props) => (props.isVisible ? "20px" : "0px")};
  padding-left: ${(props) => (props.isVisible ? "10px" : "0px")};
  color: #2a2a2a;
  overflow: hidden;
  white-space: nowrap;
  transition: font-size 0.3s ease-in-out, margin-bottom 0.3s ease-in-out;
`;

const MenuLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isVisible ? "flex-start" : "center")};
  white-space: nowrap;
  overflow: hidden;
  gap: 10px;
`;

const MenuIcon = styled.div`
  font-size: 20px;
  color: #001f3d;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isVisible ? "space-between" : "center")};
  align-items: center;
  padding: ${(props) => (props.isVisible ? "15px 10px" : "10px 0")};
  font-size: ${(props) => (props.isVisible ? "14px" : "0px")};
  font-weight: 500;
  color: ${(props) => (props.isVisible ? "#001f3d" : "transparent")};
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #d9d9d9;
    color: #001f3d;
    border-radius: 50px;
  }
`;

const SubMenuItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #001f3d;
  margin: 5px 0;
  cursor: pointer;

  &:hover {
    background-color: #d9d9d9;
    color: #001f3d;
    border-radius: 10px;
  }
`;

const HamburgerIcon = styled.span`
  position: fixed;
  top: 15px;
  right: 15px;
  font-size: 30px;
  cursor: pointer;
  z-index: 25;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 15;
  display: ${(props) => (props.isVisible ? "block" : "none")};
`;

const SubadminSidebar = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true); // Desktop behavior
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const sidebarRef = useRef(null);

  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleOutsideClick = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarVisible(false); // Close sidebar on outside click (desktop)
      setExpandedItem(null); // Close expanded items
    }
  };

  useEffect(() => {
    const updateView = () => {
      setIsMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) setSidebarVisible(true); // Ensure desktop behavior
    };

    window.addEventListener("resize", updateView);

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("resize", updateView);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobileView]);

  const navigateAndCloseSidebar = (path) => {
    if (isMobileView) setSidebarVisible(false); // Collapse sidebar on mobile
    navigate(path);
  };

  const handleSidebarClick = () => {
    if (!isMobileView) {
      setSidebarVisible(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* Hamburger Icon */}
      {isMobileView && (
        <HamburgerIcon onClick={() => setSidebarVisible(true)}>☰</HamburgerIcon>
      )}

      {/* Overlay */}
      {isMobileView && (
        <Overlay
          isVisible={sidebarVisible}
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Sidebar Container */}
      <SidebarContainer
        ref={sidebarRef}
        isVisible={sidebarVisible}
        isMobileView={isMobileView}
        onClick={handleSidebarClick}
      >
        <SidebarMenuTitle isVisible={sidebarVisible}>Menu</SidebarMenuTitle>

        <MenuItem
          isVisible={sidebarVisible}
          onClick={() => navigateAndCloseSidebar("/branch/dashboard")}
        >
          <MenuLabel isVisible={sidebarVisible}>
            <MenuIcon>
              <MdOutlineDashboard />
            </MenuIcon>
            {sidebarVisible && "Dashboard"}
          </MenuLabel>
        </MenuItem>

        <div onClick={() => toggleExpand(2)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <TbSchool />
              </MenuIcon>
              {sidebarVisible && "Enquiry"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 2 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>

        {expandedItem === 2 && (
          <>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/addenquiry")}
            >
              Add Enquiry
            </SubMenuItem>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/enquirystatus")}
            >
              Enquiry Status
            </SubMenuItem>
            <SubMenuItem
              onClick={() =>
                navigateAndCloseSidebar("/branch/enquiry-followup")
              }
            >
              Follow Ups
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(3)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <NotebookPen />
              </MenuIcon>
              {sidebarVisible && "Students Admission"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 3 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 3 && (
          <>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/allstudent")}
            >
              All Students
            </SubMenuItem>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/admissionform")}
            >
              Add Student
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(4)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <UserRound />
              </MenuIcon>
              {sidebarVisible && "Teacher"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 4 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 4 && (
          <>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/allteacher")}
            >
              All Teachers
            </SubMenuItem>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/addteacher")}
            >
              Add Teacher
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(6)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <BookmarkCheck />
              </MenuIcon>
              {sidebarVisible && "Attendance"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 6 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 6 && (
          <>
            <SubMenuItem
              onClick={() =>
                navigateAndCloseSidebar("/branch/teacherattendance")
              }
            >
              Teacher Attendance
            </SubMenuItem>
            <SubMenuItem
              onClick={() =>
                navigateAndCloseSidebar("/branch/studentattendance")
              }
            >
              Student Attendance
            </SubMenuItem>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/attendancetype")}
            >
              Attendance Table
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(7)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <IndianRupeeIcon />
              </MenuIcon>
              {sidebarVisible && "Fee"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 7 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 7 && (
          <>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/allfee")}
            >
              All Fee
            </SubMenuItem>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/pending-fee")}
            >
              Pending Fee
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(8)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <HandCoins />
              </MenuIcon>
              {sidebarVisible && "Salary"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 8 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 8 && (
          <>
            <SubMenuItem
              onClick={() => navigateAndCloseSidebar("/branch/allsalary")}
            >
              All Salary
            </SubMenuItem>
          </>
        )}

        <MenuItem
          isVisible={sidebarVisible}
          onClick={() => navigateAndCloseSidebar("/branch/allcourse")}
        >
          <MenuLabel isVisible={sidebarVisible}>
            <MenuIcon>
              <School2 />
            </MenuIcon>
            {sidebarVisible && "Course"}
          </MenuLabel>
        </MenuItem>

        <MenuItem
          isVisible={sidebarVisible}
          onClick={() => navigateAndCloseSidebar("/branch/update-batch")}
        >
          <MenuLabel isVisible={sidebarVisible}>
            <MenuIcon>
              <User2 />
            </MenuIcon>
            {sidebarVisible && "Batch"}
          </MenuLabel>
        </MenuItem>
        <MenuItem
          isVisible={sidebarVisible}
          onClick={() => navigateAndCloseSidebar("/branch/profile")}
        >
          <MenuLabel isVisible={sidebarVisible}>
            <MenuIcon>
              <UserRoundPen />
            </MenuIcon>
            {sidebarVisible && "Profile"}
          </MenuLabel>
        </MenuItem>
        <MenuItem
          isVisible={sidebarVisible}
          onClick={() => navigateAndCloseSidebar("/branch/change-password")}
        >
          <MenuLabel isVisible={sidebarVisible}>
            <MenuIcon>
              <KeyRound />
            </MenuIcon>
            {sidebarVisible && "Change Password"}
          </MenuLabel>
        </MenuItem>
        <MenuItem onClick={logout} isVisible={sidebarVisible}>
          <MenuLabel isVisible={sidebarVisible}>
            <MenuIcon>
              <LogOut />
            </MenuIcon>
            {sidebarVisible && "Logout"}
          </MenuLabel>
        </MenuItem>
      </SidebarContainer>
    </>
  );
};

export default SubadminSidebar;
