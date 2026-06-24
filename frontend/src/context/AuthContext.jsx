import { createContext, useState, useEffect } from 'react';
import api from '../../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('access_token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
            localStorage.setItem('access_token', token);
        } else {
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await api.post('/token/', {
                username,
                password
            });
            setToken(response.data.access);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
