import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://${window.location.hostname}:8000/api/'
// });

// Extracts whatever host IP your browser is currently looking at (e.g., 100.124.123.98)
const currentHost = window.location.hostname;

const api = axios.create({
    baseURL: `http://${currentHost}:8000/api`, // Dynamically targets Django on the same host machine
});

// Add interceptor to attach token to every request
api.interceptors.request.use((config) => {
    // Check for 'access' (used by Login components) or 'access_token' (legacy/fallback)
    const token = localStorage.getItem('access') || localStorage.getItem('access_token');
    if (token) {
        if (config.headers && typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${token}`);
        } else {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor to handle 401/403 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401 || status === 403) {
                // Token is invalid, expired, or access is forbidden
                localStorage.removeItem('access_token');
                localStorage.removeItem('access');
                
                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;