// src/pages/UsersPage.js
import React, { useState, useEffect } from 'react';
import { userApi } from '../api';
import Message from '../components/Message';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', registration_number: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (page = 1) => {
        try {
            const response = await userApi.getAll(page);
            setUsers(Array.isArray(response.data.data) ? response.data.data : []);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                next_page_url: response.data.next_page_url,
                prev_page_url: response.data.prev_page_url
            });
            setError('');
        } catch (err) {
            setError('Erro ao carregar usuários: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingUser) {
            setEditingUser(prev => ({ ...prev, [name]: value }));
        } else {
            setNewUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            if (editingUser) {

                const dataToSend = { ...editingUser };
                if (dataToSend.password === '') { // Se a senha estiver vazia, não a envie
                    delete dataToSend.password;
                }
                await userApi.update(editingUser.id, dataToSend);
                setMessage('Usuário atualizado com sucesso!');
                setEditingUser(null);
            } else {
                await userApi.create(newUserData);
                setMessage('Usuário criado com sucesso!');
                setNewUserData({ name: '', email: '', password: '', registration_number: '' });
            }
            fetchUsers();
        } catch (err) {
            setError('Erro ao salvar usuário: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (user) => {
        setEditingUser({ ...user, password: '' }); // Limpa a senha ao editar
        setMessage('');
        setError('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            setMessage('');
            setError('');
            try {
                await userApi.remove(id);
                setMessage('Usuário excluído com sucesso!');
                fetchUsers();
            } catch (err) {
                setError('Erro ao excluir usuário: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h2>Gerenciar Usuários</h2>
            <Message message={message} type="success" />
            <Message message={error} type="error" />

            <div style={styles.formSection}>
                <h3>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h3>
                <form onSubmit={handleSubmit} style={styles.formGrid}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
                        value={editingUser ? editingUser.name : newUserData.name}
                        onChange={handleInputChange}
                        required
                        style={styles.inputField}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={editingUser ? editingUser.email : newUserData.email}
                        onChange={handleInputChange}
                        required
                        style={styles.inputField}
                    />
                    <input
                        type="text"
                        name="registration_number"
                        placeholder="Matrícula"
                        value={editingUser ? editingUser.registration_number : newUserData.registration_number}
                        onChange={handleInputChange}
                        required
                        style={styles.inputField}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder={editingUser ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                        value={editingUser ? editingUser.password : newUserData.password}
                        onChange={handleInputChange}
                        required={!editingUser} // Senha é obrigatória apenas para novos usuários
                        style={styles.inputField}
                    />
                    <div style={styles.formActions}>
                        <button type="submit" style={styles.primaryButton}>
                            {editingUser ? 'Salvar Edição' : 'Adicionar Usuário'}
                        </button>
                        {editingUser && (
                            <button
                                type="button"
                                onClick={() => { setEditingUser(null); setNewUserData({ name: '', email: '', password: '', registration_number: '' }); setError(''); setMessage(''); }}
                                style={styles.secondaryButton}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h3 style={{ marginTop: '40px' }}>Lista de Usuários</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nome</th>
                        <th style={styles.th}>E-mail</th>
                        <th style={styles.th}>Matrícula</th>
                        <th style={styles.th}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(users) ? users : []).length === 0 ? (
                        <tr><td colSpan="5" style={styles.tdCenter}>Nenhum usuário encontrado.</td></tr>
                    ) : (
                        (Array.isArray(users) ? users : []).map(user => (
                            <tr key={user.id}>
                                <td style={styles.td}>{user.id}</td>
                                <td style={styles.td}>{user.name}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>{user.registration_number}</td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(user)} style={styles.editButton}>Editar</button>
                                    <button onClick={() => handleDelete(user.id)} style={styles.deleteButton}>Excluir</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {/* Botões de paginação */}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
                <button
                    onClick={() => fetchUsers(pagination.current_page - 1)}
                    disabled={!pagination.prev_page_url}
                    style={{ marginRight: 10 }}
                >
                    Anterior
                </button>
                <span>Página {pagination.current_page} de {pagination.last_page}</span>
                <button
                    onClick={() => fetchUsers(pagination.current_page + 1)}
                    disabled={!pagination.next_page_url}
                    style={{ marginLeft: 10 }}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: { padding: '20px' },
    formSection: { border: '1px solid #eee', borderRadius: '8px', padding: '20px', marginBottom: '30px', backgroundColor: '#f9f9f9' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    inputField: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
    formActions: { gridColumn: 'span 2', textAlign: 'right', marginTop: '10px' },
    primaryButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
    secondaryButton: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { padding: '12px', border: '1px solid #ddd', textAlign: 'left', backgroundColor: '#f2f2f2' },
    td: { padding: '10px', border: '1px solid #ddd', textAlign: 'left' },
    tdCenter: { padding: '10px', border: '1px solid #ddd', textAlign: 'center' },
    editButton: { padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    deleteButton: { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default UsersPage;