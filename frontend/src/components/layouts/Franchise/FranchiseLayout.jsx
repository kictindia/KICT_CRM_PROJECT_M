import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import TeacherSidebar from './TeacherSidebar';

const Container = styled.div`
  display: flex;
  background-color: #f4f4f4;
`;

const FranchiseLayout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('Role');
        if (token !== "Teacher") {
            navigate('/');
        }
    })
    return (
        <>
            <Navbar />
            <Container>
                <TeacherSidebar />
                <Outlet />
            </Container>
        </>
    )
}

export default FranchiseLayout;
