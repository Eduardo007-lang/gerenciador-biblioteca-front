import React, { useState, useEffect } from "react";
import { bookApi, genreApi } from "../api";
import Message from "../components/Message";
import Select from 'react-select';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [newBookData, setNewBookData] = useState({
    name: "",
    registration_number: "",
    author: "",
    genre_ids: [],
    status: "available",
  });
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookApi.getAll();
      setBooks(response.data);
      setError("");
    } catch (err) {
      setError(
        "Erro ao carregar livros: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

const fetchGenres = async () => {
    try {
        const response = await genreApi.getAll();
        
        const formattedGenres = response.data.map(genre => ({
            value: genre.id,
            label: genre.genre 
        }));
        setGenres(formattedGenres); 
        setError("");
    } catch (err) {
        setError(
            "Erro ao carregar gêneros: " +
            (err.response?.data?.message || err.message)
        );
        
        console.error("Erro ao buscar gêneros:", err.response || err);
    }
};

 const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingBook) {
            setEditingBook(prev => ({ ...prev, [name]: value }));
        } else {
            setNewBookData(prev => ({ ...prev, [name]: value }));
        }
    };

 const handleSelectChange = (selectedOptions) => {
        const selectedGenreIds = selectedOptions ? selectedOptions.map(option => option.value) : [];

        if (editingBook) {
            setEditingBook(prev => ({ ...prev, genre_ids: selectedGenreIds }));
        } else {
            setNewBookData(prev => ({ ...prev, genre_ids: selectedGenreIds }));
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      let dataToSend;

      if (editingBook) {
        dataToSend = {
          name: editingBook.name,
          author: editingBook.author,
          registration_number: editingBook.registration_number,
          status: editingBook.status,
          genres: editingBook.genre_ids,
        };
        await bookApi.update(editingBook.id, dataToSend);
        setMessage("Livro atualizado com sucesso!");
        setEditingBook(null);
      } else {
        dataToSend = {
          name: newBookData.name,
          author: newBookData.author,
          registration_number: newBookData.registration_number,
          status: newBookData.status,
          genres: newBookData.genre_ids,
        };
        await bookApi.create(dataToSend);
        setMessage("Livro criado com sucesso!");
        setNewBookData({
          name: "",
          registration_number: "",
          author: "",
          genre_ids: [],
          status: "available",
        });
      }
      fetchBooks();
    } catch (err) {
      setError(
        "Erro ao salvar livro: " + (err.response?.data?.message || err.message)
      );
      console.error("Erro ao salvar livro:", err.response || err); // Para depuração
    }
  };

  const handleEdit = (book) => {
    setEditingBook({
        ...book,
        // Ao editar, extraia e formate os gêneros do array 'genres' do livro
        genre_ids: book.genres ? book.genres.map(g => ({ value: g.id, label: g.genre })) : [],
    });
    setMessage("");
    setError("");
};

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este livro?")) {
      setMessage("");
      setError("");
      try {
        await bookApi.remove(id);
        setMessage("Livro excluído com sucesso!");
        fetchBooks();
      } catch (err) {
        setError(
          "Erro ao excluir livro: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

    const selectedGenresForSelect = editingBook 
        ? editingBook.genre_ids 
        : newBookData.genre_ids; 
    
    const currentSelectedGenreOptions = (editingBook ? editingBook.genre_ids : newBookData.genre_ids)
    .map(id => genres.find(genre => genre.value === id))
    .filter(Boolean); 

  return (
    <div style={styles.pageContainer}>
      <h2>Gerenciar Livros</h2>
      <Message message={message} type="success" />
      <Message message={error} type="error" />

      <div style={styles.formSection}>
        <h3>{editingBook ? "Editar Livro" : "Adicionar Novo Livro"}</h3>
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <input
            type="text"
            name="name"
            placeholder="Título"
            value={editingBook ? editingBook.name : newBookData.name}
            onChange={handleInputChange}
            required
            style={styles.inputField}
          />
          <input
            type="text"
            name="registration_number"
            placeholder="Numero de Registro"
            value={
              editingBook
                ? editingBook.registration_number
                : newBookData.registration_number
            }
            onChange={handleInputChange}
            required
            style={styles.inputField}
          />
          <input
            type="text"
            name="author"
            placeholder="Autor"
            value={editingBook ? editingBook.author : newBookData.author}
            onChange={handleInputChange}
            required
            style={styles.inputField}
          />
                    
    
         <div style={styles.formGroup}>
                    <label htmlFor="genre_ids" style={styles.label}>Gêneros:</label>
                    <Select
                        isMulti 
                        name="genre_ids"
                        options={genres}
                    
                        value={currentSelectedGenreOptions} 
                        onChange={handleSelectChange}
                        classNamePrefix="react-select"
                        placeholder="Selecione os Gêneros"
                        styles={{ 
                            container: (base) => ({ 
                                ...base, 
                                width: '100%', 
                                fontSize: '16px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                            }),
                            control: (base) => ({
                                ...base,
                                borderColor: 'transparent',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: 'transparent',
                                },
                            }),
                        
                            multiValue: (base) => ({
                                ...base,
                                backgroundColor: '#e2e6ea',
                                borderRadius: '4px',
                            }),
                            multiValueLabel: (base) => ({
                                ...base,
                                color: '#333',
                            }),
                            multiValueRemove: (base) => ({
                                ...base,
                                '&:hover': {
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                },
                            }),
                        }}
                    />
                </div>
          <select
            name="status"
            value={editingBook ? editingBook.status : newBookData.status}
            onChange={handleInputChange}
            required
            style={styles.inputField}
          >
            <option value="available">Disponível</option>
            <option value="borrowed">Emprestado</option>
          </select>
          <div style={styles.formActions}>
            <button type="submit" style={styles.primaryButton}>
              {editingBook ? "Salvar Edição" : "Adicionar Livro"}
            </button>
            {editingBook && (
              <button
                type="button"
                onClick={() => {
                  setEditingBook(null);
                  setNewBookData({
                    name: "",
                    registration_number: "",
                    author: "",
                     genre_ids: [],
                    status: "available",
                  });
                  setError("");
                  setMessage("");
                }}
                style={styles.secondaryButton}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 style={{ marginTop: "40px" }}>Lista de Livros</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Título</th>
            <th style={styles.th}>Nº de Registro</th>
            <th style={styles.th}>Autor</th>
            <th style={styles.th}>Gênero</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="8" style={styles.tdCenter}>
                Nenhum livro encontrado.
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id}>
                <td style={styles.td}>{book.id}</td>
                <td style={styles.td}>{book.name}</td>
                <td style={styles.td}>{book.registration_number}</td>
                <td style={styles.td}>{book.author}</td>
                <td style={styles.td}>
                  {book.genres.map((genre) => genre.genre).join(", ") || "N/A"}
                </td>
                <td style={styles.td}>{book.status === "available" ? "Disponível" : "Emprestado"}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(book)}
                    style={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    style={styles.deleteButton}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "20px",
  },
  formSection: {
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    backgroundColor: "#f9f9f9",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  inputField: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  formActions: {
    gridColumn: "span 2",
    textAlign: "right",
    marginTop: "10px",
  },
  primaryButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  secondaryButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  tdCenter: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#ffc107",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default BooksPage;
