// src/api/index.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/V1'; // Ajuste para a URL da sua API Laravel

// Crie a instância do Axios AQUI, fora de qualquer função
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// FUNÇÃO CHAVE: Define o token de autorização para esta instância específica do Axios
export const setAuthToken = (token) => {
    if (token) {
        // Agora, axiosInstance está definido e podemos configurar seus defaults
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Se não houver token, remova o cabeçalho de autorização
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

// --- Funções Genéricas para CRUD ---
const createEntityApi = (endpoint) => ({
    // Use a instância axiosInstance para todas as chamadas
    getAll: () => axiosInstance.get(`/${endpoint}`),
    getById: (id) => axiosInstance.get(`/${endpoint}/${id}`),
    create: (data) => axiosInstance.post(`/${endpoint}`, data),
    update: (id, data) => axiosInstance.put(`/${endpoint}/${id}`, data),
    remove: (id) => axiosInstance.delete(`/${endpoint}/${id}`),
});

export const userApi = createEntityApi('users');
export const bookApi = createEntityApi('books');
export const genreApi = createEntityApi('genres');

// --- Funções Específicas para Loans ---
export const loanApi = {
    // Use a instância axiosInstance para todas as chamadas
    getAll: () => axiosInstance.get('/loans'),
    getById: (id) => axiosInstance.get(`/loans/${id}`),
    create: (data) => axiosInstance.post('/loans', data),
    update: (id, data) => axiosInstance.put(`/loans/${id}`, data),
    remove: (id) => axiosInstance.delete(`/loans/${id}`),
    returnLoan: (loanId) => axiosInstance.put(`/loans/${loanId}/return`),
};

// Funções para buscar opções de dropdown (também usam axiosInstance)
export const fetchAllUsers = () => userApi.getAll();
export const fetchAllBooks = () => bookApi.getAll();
export const fetchAllGenres = () => genreApi.getAll();