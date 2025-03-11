import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { TbSchool } from "react-icons/tb";
import {
  BookmarkCheck,
  Eye,
  HandCoins,
  IndianRupeeIcon,
  KeyRound,
  LogOut,
  NotebookPen,
  School2,
  Split,
  TicketCheck,
  User2,
  UserRound,
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
  padding: ${(props) => (props.isVisible ? "15px 10px" : "15px 0")};
  font-size: ${(props) => (props.isVisible ? "16px" : "0px")};
  font-weight: 500;
  color: ${(props) =>
    props.isSelected ? "#ffffff" : props.isVisible ? "#001f3d" : "transparent"};
  background-color: ${(props) =>
    props.isSelected ? "#d9d9d9" : "transparent"};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  outline: none;

  &:hover {
    background-color: #d9d9d9;
    color: #001f3d;
    border-radius: 50px;
  }
`;

const slideDown = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    max-height: 500px;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
`;
const SubMenuItem = styled.div`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.isSelected ? "#ffffff" : "#001f3d")};
  background-color: ${(props) =>
    props.isSelected ? "#d9d9d9" : "transparent"};
  margin: 5px 0;
  cursor: pointer;
  animation: ${(props) => (props.isExpanded ? slideDown : slideUp)} 0.3s
    ease-in-out;
  max-height: ${(props) => (props.isExpanded ? "500px" : "0")};
  overflow: hidden;

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

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true); // Desktop behavior
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const sidebarRef = useRef(null);
  // const [selectedItem, setSelectedItem] = useState(null);

  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleOutsideClick = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !isMobileView
    ) {
      setSidebarVisible(false); // Close sidebar on outside click (desktop)
      setExpandedItem(null); // Close all dropdowns
    }
  };


  useEffect(() => {
    const updateView = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileView(isMobile);

      if (!isMobile) {
        setSidebarVisible(true);
      }
    };

    window.addEventListener("resize", updateView);
    updateView(); // To ensure the correct state is set on initial load
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("resize", updateView);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const navigateAndCloseSidebar = (path) => {
    // setSelectedItem(index);
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
        <HamburgerIcon onClick={() => setSidebarVisible(!sidebarVisible)}>
          ☰
        </HamburgerIcon>
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
          // isSelected={selectedItem === 1}
          onClick={() => navigateAndCloseSidebar("/admin/dashboard")}
        >
          <MenuLabel isVisible={sidebarVisible}>
            <MenuIcon>
              <MdOutlineDashboard />
            </MenuIcon>
            {sidebarVisible && "Dashboard"}
          </MenuLabel>
        </MenuItem>

        <div onClick={() => toggleExpand(6)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <TbSchool />
              </MenuIcon>
              {sidebarVisible && "Enquiry"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 6 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 6 && (
          <>
            <SubMenuItem
              isExpanded={expandedItem === 6}
              // isSelected={selectedItem === 2}
              onClick={() => navigateAndCloseSidebar("/admin/addenquiry")}
            >
              Add Enquiry
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 6}
              onClick={() => navigateAndCloseSidebar("/admin/enquirystatus")}
            >
              All Enquiry
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 6}
              onClick={() => navigateAndCloseSidebar("/admin/enquiry-followup")}
            >
              Follow Ups
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(2)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <NotebookPen />
              </MenuIcon>
              {sidebarVisible && "Students Admission"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 2 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 2 && (
          <>
            <SubMenuItem
              isExpanded={expandedItem === 2}
              onClick={() => navigateAndCloseSidebar("/admin/allstudent")}
            >
              All Student
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 2}
              onClick={() => navigateAndCloseSidebar("/admin/admissionform")}
            >
              Add Student
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 2}
              onClick={() => navigateAndCloseSidebar("/admin/pending-student")}
            >
              Pending Student
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(3)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <Split />
              </MenuIcon>
              {sidebarVisible && "Franchise"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 3 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 3 && (
          <>
            <SubMenuItem
              isExpanded={expandedItem === 3}
              onClick={() => navigateAndCloseSidebar("/admin/addfranchise")}
            >
              Add Franchise
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 3}
              onClick={() => navigateAndCloseSidebar("/admin/allfranchise")}
            >
              All Franchise
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
              isExpanded={expandedItem === 4}
              onClick={() => navigateAndCloseSidebar("/admin/addteacher")}
            >
              Add Teacher
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 4}
              onClick={() => navigateAndCloseSidebar("/admin/allteacher")}
            >
              All Teacher
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(5)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <School2 />
              </MenuIcon>
              {sidebarVisible && "Course"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 5 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 5 && (
          <>
            <SubMenuItem
              isExpanded={expandedItem === 5}
              onClick={() => navigateAndCloseSidebar("/admin/addcourse")}
            >
              Add Course
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 5}
              onClick={() => navigateAndCloseSidebar("/admin/allcourse")}
            >
              All Courses
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(10)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <TicketCheck />
              </MenuIcon>
              {sidebarVisible && "Certificate"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 10 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 10 && (
          <>
            <SubMenuItem
              isExpanded={expandedItem === 10}
              onClick={() => navigateAndCloseSidebar("/admin/course-table")}
            >
              Add Certificate
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 10}
              onClick={() => navigateAndCloseSidebar("/admin/list-certificate")}
            >
              All Certificate
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 10}
              onClick={() =>
                navigateAndCloseSidebar("/admin/approve-certificate")
              }
            >
              Approve Certificate
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(7)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <BookmarkCheck />
              </MenuIcon>
              {sidebarVisible && "Attendance"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 7 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 7 && (
          <>
            <SubMenuItem
              isExpanded={expandedItem === 7}
              onClick={() =>
                navigateAndCloseSidebar("/admin/teacherattendance")
              }
            >
              Teacher Attendance
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 7}
              onClick={() =>
                navigateAndCloseSidebar("/admin/studentattendance")
              }
            >
              Student Attendance
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 7}
              onClick={() => navigateAndCloseSidebar("/admin/attendancetype")}
            >
              Attendance Type
            </SubMenuItem>
          </>
        )}

        <div onClick={() => toggleExpand(8)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <IndianRupeeIcon />
              </MenuIcon>
              {sidebarVisible && "Fee"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 8 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 8 && (
          <>
            <SubMenuItem
              isExpanded={expandedItem === 8}
              onClick={() => navigateAndCloseSidebar("/admin/allfee")}
            >
              Fee Receipt
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 8}
              onClick={() => navigateAndCloseSidebar("/admin/pay-fee")}
            >
              Fee Collect
            </SubMenuItem>
            <SubMenuItem
              isExpanded={expandedItem === 8}
              onClick={() => navigateAndCloseSidebar("/admin/pending-fee")}
            >
              Pending Fee
            </SubMenuItem>

            <SubMenuItem
              isExpanded={expandedItem === 8}
              onClick={() => navigateAndCloseSidebar("/admin/View-transaction")}
            >
              View Transaction
            </SubMenuItem>

          </>
        )}

        <div onClick={() => toggleExpand(9)}>
          <MenuItem isVisible={sidebarVisible}>
            <MenuLabel isVisible={sidebarVisible}>
              <MenuIcon>
                <HandCoins />
              </MenuIcon>
              {sidebarVisible && "Salary"}
            </MenuLabel>
            {sidebarVisible &&
              (expandedItem === 9 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
          </MenuItem>
        </div>
        {expandedItem === 9 && (
          <>
            <SubMenuItem
              isExpanded={expandedItem === 9}
              onClick={() => navigateAndCloseSidebar("/admin/allsalary")}
            >
              All Salary
            </SubMenuItem>
          </>
        )}

        <MenuItem
          isVisible={sidebarVisible}
          onClick={() => navigateAndCloseSidebar("/admin/all-batch")}
        >
          <MenuLabel isVisible={sidebarVisible}>
            <MenuIcon>
              <User2 />
            </MenuIcon>
            {sidebarVisible && " View Batches"}
          </MenuLabel>
        </MenuItem>

        <MenuItem
          isVisible={sidebarVisible}
          onClick={() => navigateAndCloseSidebar("/admin/view-password")}
        >
          <MenuLabel isVisible={sidebarVisible}>
            <MenuIcon>
              <Eye />
            </MenuIcon>
            {sidebarVisible && "View Accounts"}
          </MenuLabel>
        </MenuItem>

        <MenuItem
          isVisible={sidebarVisible}
          onClick={() => navigateAndCloseSidebar("/admin/change-password")}
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

export default AdminSidebar;
