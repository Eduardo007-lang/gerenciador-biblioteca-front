// src/pages/GenresPage.js
import React, { useState, useEffect } from 'react';
import { genreApi } from '../api';
import Message from '../components/Message';

const GenresPage = () => {
    const [genres, setGenres] = useState([]);
    const [newGenreData, setNewGenreData] = useState({ genre: '' }); 
    const [editingGenre, setEditingGenre] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const response = await genreApi.getAll();
            setGenres(response.data);
            setError('');
        } catch (err) {
            setError('Erro ao carregar gêneros: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingGenre) {
            setEditingGenre(prev => ({ ...prev, [name]: value }));
        } else {
            setNewGenreData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            if (editingGenre) {
                await genreApi.update(editingGenre.id, editingGenre);
                setMessage('Gênero atualizado com sucesso!');
                setEditingGenre(null);
            } else {
                await genreApi.create(newGenreData);
                setMessage('Gênero criado com sucesso!');
                setNewGenreData({ genre: '' });
            }
            fetchGenres();
        } catch (err) {
            setError('Erro ao salvar gênero: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (genre) => {
        setEditingGenre({ ...genre });
        setMessage('');
        setError('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este gênero?')) {
            setMessage('');
            setError('');
            try {
                await genreApi.remove(id);
                setMessage('Gênero excluído com sucesso!');
                fetchGenres();
            } catch (err) {
                setError('Erro ao excluir gênero: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h2>Gerenciar Gêneros</h2>
            <Message message={message} type="success" />
            <Message message={error} type="error" />

            <div style={styles.formSection}>
                <h3>{editingGenre ? 'Editar Gênero' : 'Adicionar Novo Gênero'}</h3>
                <form onSubmit={handleSubmit} style={styles.formGrid}>
                    <input
                        type="text"
                        name="genre" // Nome do campo do gênero
                        placeholder="Nome do Gênero"
                        value={editingGenre ? editingGenre.genre : newGenreData.genre}
                        onChange={handleInputChange}
                        required
                        style={styles.inputField}
                    />
                    <div style={styles.formActions}>
                        <button type="submit" style={styles.primaryButton}>
                            {editingGenre ? 'Salvar Edição' : 'Adicionar Gênero'}
                        </button>
                        {editingGenre && (
                            <button
                                type="button"
                                onClick={() => { setEditingGenre(null); setNewGenreData({ genre: '' }); setError(''); setMessage(''); }}
                                style={styles.secondaryButton}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h3 style={{ marginTop: '40px' }}>Lista de Gêneros</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Gênero</th>
                        <th style={styles.th}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {genres.length === 0 ? (
                        <tr><td colSpan="3" style={styles.tdCenter}>Nenhum gênero encontrado.</td></tr>
                    ) : (
                        genres.map(genre => (
                            <tr key={genre.id}>
                                <td style={styles.td}>{genre.id}</td>
                                <td style={styles.td}>{genre.genre}</td>
                                <td style={styles.td}>
                                    <button onClick={() => handleEdit(genre)} style={styles.editButton}>Editar</button>
                                    <button onClick={() => handleDelete(genre.id)} style={styles.deleteButton}>Excluir</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Reutilize os estilos do BooksPage ou defina novos conforme preferir
const styles = {
    pageContainer: { padding: '20px' },
    formSection: { border: '1px solid #eee', borderRadius: '8px', padding: '20px', marginBottom: '30px', backgroundColor: '#f9f9f9' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }, // Apenas uma coluna para o gênero
    inputField: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
    formActions: { textAlign: 'right', marginTop: '10px' },
    primaryButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
    secondaryButton: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { padding: '12px', border: '1px solid #ddd', textAlign: 'left', backgroundColor: '#f2f2f2' },
    td: { padding: '10px', border: '1px solid #ddd', textAlign: 'left' },
    tdCenter: { padding: '10px', border: '1px solid #ddd', textAlign: 'center' },
    editButton: { padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    deleteButton: { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default GenresPage;