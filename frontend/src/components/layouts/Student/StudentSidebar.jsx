import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { CalendarDays, KeyRound, LogOut, School2, UserRoundPen } from "lucide-react";

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
    height: calc(100vh - 20px);
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
  justify-content: ${(props) =>
        props.isVisible ? "space-between" : "center"};
  align-items: center;
  padding: ${(props) => (props.isVisible ? "15px 10px" : "15px 0")};
  font-size: ${(props) => (props.isVisible ? "16px" : "0px")};
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
  font-size: 16px;
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

const StudentSidebar = () => {
    const navigate = useNavigate();
    const [expandedItem, setExpandedItem] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(true); // Desktop behavior
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const sidebarRef = useRef(null);

    const toggleExpand = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    const handleOutsideClick = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !isMobileView) {
            setSidebarVisible(false); // Close sidebar on outside click (desktop)
        }
    };

    useEffect(() => {
        const updateView = () => {
            setIsMobileView(window.innerWidth <= 768);
            if (window.innerWidth > 768) setSidebarVisible(true); // Ensure desktop behavior
        };

        window.addEventListener("resize", updateView);

        if (isMobileView) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.addEventListener("mousedown", handleOutsideClick);
        }

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

            {/* Sidebar */}
            <SidebarContainer
                ref={sidebarRef}
                isVisible={sidebarVisible}
                isMobileView={isMobileView}
                onClick={handleSidebarClick}
            >
                <SidebarMenuTitle isVisible={sidebarVisible}>Menu</SidebarMenuTitle>

                <MenuItem
                    isVisible={sidebarVisible}
                    onClick={() => navigateAndCloseSidebar("/student/dashboard")}
                >
                    <MenuLabel isVisible={sidebarVisible}>
                        <MenuIcon>
                            <MdOutlineDashboard />
                        </MenuIcon>
                        {sidebarVisible && "Dashboard"}
                    </MenuLabel>
                </MenuItem>

                <div onClick={() => toggleExpand(3)}>
                    <MenuItem isVisible={sidebarVisible}>
                        <MenuLabel isVisible={sidebarVisible}>
                            <MenuIcon>
                                <School2 />
                            </MenuIcon>
                            {sidebarVisible && "Courses"}
                        </MenuLabel>
                        {sidebarVisible &&
                            (expandedItem === 3 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
                    </MenuItem>
                </div>

                {expandedItem === 3 && sidebarVisible && (
                    <SubMenuItem onClick={() => navigateAndCloseSidebar("/student/studentcourse")}>
                        Enroll Courses
                    </SubMenuItem>
                )}

                <div onClick={() => toggleExpand(2)}>
                    <MenuItem isVisible={sidebarVisible}>
                        <MenuLabel isVisible={sidebarVisible}>
                            <MenuIcon>
                                <CalendarDays />
                            </MenuIcon>
                            {sidebarVisible && "Time Table"}
                        </MenuLabel>
                        {sidebarVisible &&
                            (expandedItem === 2 ? <IoIosArrowUp /> : <IoIosArrowDown />)}
                    </MenuItem>
                </div>

                {expandedItem === 2 && sidebarVisible && (
                    <SubMenuItem onClick={() => navigateAndCloseSidebar("/student/batchtiming")}>
                        Batch Timings
                    </SubMenuItem>
                )}

                <MenuItem
                    isVisible={sidebarVisible}
                    onClick={() => navigateAndCloseSidebar("/student/profile")}
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
                    onClick={() => navigateAndCloseSidebar("/student/change-password")}
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

export default StudentSidebar;
