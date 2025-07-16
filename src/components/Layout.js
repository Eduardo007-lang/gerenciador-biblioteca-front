// src/components/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';

// Recebe `isAuthenticated` e `onLogout` como props
const Layout = ({ children, isAuthenticated, onLogout }) => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Sistema de Biblioteca</h1>
                <nav>
                    <ul style={styles.navList}>
                        {isAuthenticated && ( 
                            <>
                                <li style={styles.navItem}><Link to="/users" style={styles.navLink}>Usuários</Link></li>
                                <li style={styles.navItem}><Link to="/books" style={styles.navLink}>Livros</Link></li>
                                <li style={styles.navItem}><Link to="/genres" style={styles.navLink}>Gêneros</Link></li>
                                <li style={styles.navItem}><Link to="/loans" style={styles.navLink}>Empréstimos</Link></li>
                                <li style={styles.navItem}>
                                    <button onClick={onLogout} style={styles.logoutButton}>Sair</button>
                                </li>
                            </>
                        )}
                        {!isAuthenticated && ( 
                            <li style={styles.navItem}><Link to="/login" style={styles.navLink}>Login</Link></li>
                        )}
                    </ul>
                </nav>
            </header>
            <main style={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1000px',
        margin: '20px auto',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: '#fff',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee',
        marginBottom: '20px',
    },
    title: {
        margin: 0,
        color: '#333',
    },
    navList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
    },
    navItem: {
        marginLeft: '20px',
    },
    navLink: {
        textDecoration: 'none',
        color: '#007bff',
        fontWeight: 'bold',
    },
    logoutButton: { // Estilo para o botão de logout
        background: 'none',
        border: 'none',
        color: '#dc3545',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '16px',
        padding: 0,
        margin: 0,
    },
    mainContent: {
        padding: '20px 0',
    },
};

export default Layout;