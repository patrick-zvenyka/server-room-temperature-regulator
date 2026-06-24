import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('access_token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const login = async (username, password) => {
        try {
            const response = await api.post('/token/', {
                username,
                password
            });
            const newToken = response.data.access;
            setToken(newToken);
            setIsAuthenticated(true);
            localStorage.setItem('access_token', newToken);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = useCallback(async () => {
        try {
            await api.post('/users/activity/', {
                action_type: 'LOGOUT',
                description: 'User logged out.'
            });
        } catch (error) {
            console.error('Failed to log logout action', error);
        } finally {
            setToken(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
        }
    }, []);

    // 3-Minute Inactivity Timer
    useEffect(() => {
        if (!isAuthenticated) return;

        let timeoutId;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                console.warn('User inactive for 3 minutes. Auto-logging out.');
                logout();
            }, 3 * 60 * 1000); // 3 minutes
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        events.forEach(event => document.addEventListener(event, resetTimer));
        resetTimer(); // Start timer immediately on mount/auth

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [isAuthenticated, logout]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
