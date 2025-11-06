import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAdmin();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

