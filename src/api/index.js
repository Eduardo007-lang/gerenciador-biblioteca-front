
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/V1'; 


const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const setAuthToken = (token) => {
    if (token) {
        
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
    
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};


const createEntityApi = (endpoint) => ({
    
    getAll: () => axiosInstance.get(`/${endpoint}`),
    getById: (id) => axiosInstance.get(`/${endpoint}/${id}`),
    create: (data) => axiosInstance.post(`/${endpoint}`, data),
    update: (id, data) => axiosInstance.put(`/${endpoint}/${id}`, data),
    remove: (id) => axiosInstance.delete(`/${endpoint}/${id}`),
});

export const userApi = createEntityApi('users');
export const bookApi = createEntityApi('books');
export const genreApi = createEntityApi('genres');

export const loanApi = {
    
    getAll: () => axiosInstance.get('/loans'),
    getById: (id) => axiosInstance.get(`/loans/${id}`),
    create: (data) => axiosInstance.post('/loans', data),
    update: (id, data) => axiosInstance.put(`/loans/${id}`, data),
    remove: (id) => axiosInstance.delete(`/loans/${id}`),
    returnLoan: (loanId) => axiosInstance.put(`/loans/${loanId}/return`),
};

export const fetchAllUsers = () => userApi.getAll();
export const fetchAllBooks = () => bookApi.getAll();
export const fetchAllGenres = () => genreApi.getAll();