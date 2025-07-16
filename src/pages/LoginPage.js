// src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import Message from '../components/Message'; 


const API_LOGIN_URL = 'http://127.0.0.1:8000/api/login'; 


const LoginPage = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Para desabilitar o botão enquanto carrega

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(API_LOGIN_URL, credentials);
            
            const { token, user } = response.data; 
            
            localStorage.setItem('authToken', token);

            setMessage('Login realizado com sucesso! Redirecionando...');
            
            if (onLoginSuccess) {
                onLoginSuccess(token, user);
            }

        } catch (err) {
            setError('Erro no login: ' + (err.response?.data?.message || 'Credenciais inválidas.'));
            console.error("Erro de login:", err.response || err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login</h2>
            <Message message={message} type="success" />
            <Message message={error} type="error" />

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleInputChange}
                        required
                        style={styles.inputField}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>Senha:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                        style={styles.inputField}
                    />
                </div>
                <button type="submit" disabled={isLoading} style={styles.button}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '400px',
        margin: '50px auto',
        padding: '30px',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        borderRadius: '10px',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    title: {
        marginBottom: '25px',
        color: '#333',
        fontSize: '28px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
    },
    inputField: {
        width: 'calc(100% - 20px)', // Ajuste para padding
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
    },
    button: {
        padding: '12px 25px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '18px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};

export default LoginPage;