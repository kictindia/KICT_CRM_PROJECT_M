import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import StudentSidebar from './StudentSidebar';

const Container = styled.div`
  display: flex;
  background-color: #f4f4f4;
`;



const StudentLayout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('Role');
        if (token !== "Student") {
            navigate('/');
        }
    })

    return (
        <>
            <Navbar />
            <Container>
                <StudentSidebar />
                <Outlet />
            </Container>
        </>
    )
}

export default StudentLayout;
