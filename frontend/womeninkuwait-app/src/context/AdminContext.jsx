import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));

    // Set up axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('adminToken', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('adminToken');
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/admin/login`, {
                username,
                password
            });
            const { token: newToken } = response.data;
            setToken(newToken);
            setAdmin(response.data.admin);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: `${API_URL}/api/admin/login`
            });
            return {
                success: false,
                error: error.response?.data?.msg || error.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem('adminToken');
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    const value = {
        admin,
        token,
        login,
        logout,
        loading
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

