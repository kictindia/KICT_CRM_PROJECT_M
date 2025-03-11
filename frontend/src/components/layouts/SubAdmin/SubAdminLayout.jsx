import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import SubAdminSidebar from './SubAdminSidebar';

const Container = styled.div`
  display: flex;
  background-color: #f4f4f4;
`;

const SubAdminLayout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('Role');
        if (token !== "Franchise") {
            navigate('/');
        }
    })
    return (
        <>
            <Navbar />
            <Container>
                <SubAdminSidebar />
                <Outlet />
            </Container>
        </>
    )
}

export default SubAdminLayout
