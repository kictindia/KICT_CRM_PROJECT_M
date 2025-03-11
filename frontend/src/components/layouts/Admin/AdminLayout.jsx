import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import AdminSidebar from './Sidebar';

const Container = styled.div`
  display: flex;
  background-color: #f4f4f4;
`;

const AdminLayout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('Role');
        if (token !== "Admin") {
            navigate('/');
        }
    })
    return (
        <>
            <Navbar />
            <Container>
                <AdminSidebar />
                <Outlet />
            </Container>
        </>
    )
}

export default AdminLayout
