// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import UsersPage from './pages/UsersPage';   
import BooksPage from './pages/BooksPage';   
import GenresPage from './pages/GenresPage'; 
import LoansPage from './pages/LoansPage';   
import LoginPage from './pages/LoginPage'; 
import { setAuthToken } from './api'; 

import './App.css'; 
import axios from 'axios';

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setIsAuthenticated(false);
      delete axios.defaults.headers.common['Authorization'];
      return;
    }
    setIsAuthenticated(true);
    setAuthToken(token); 

  }, []);


  const handleLoginSuccess = (token, user) => {
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization']; 
  };

  return (
    <Router>
      
      <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/loans" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} 
          />
          
          
          <Route 
            path="/users" 
            element={isAuthenticated ? <UsersPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/books" 
            element={isAuthenticated ? <BooksPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/genres" 
            element={isAuthenticated ? <GenresPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/loans" 
            element={isAuthenticated ? <LoansPage /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/loans" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;