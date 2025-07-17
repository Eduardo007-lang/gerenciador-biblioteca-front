// src/pages/LoansPage.js
import React, { useState, useEffect } from "react";
import { loanApi, userApi, bookApi } from "../api";
import Message from "../components/Message";
import { format, parseISO } from "date-fns";

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [newLoanData, setNewLoanData] = useState({
    user_id: "",
    book_id: "",
    loan_date: format(new Date(), "yyyy-MM-dd"),
    return_date: format(new Date(), "yyyy-MM-dd"),
    status: "pending",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null
  });


  useEffect(() => {
    fetchLoans();
    fetchUsers();
    fetchBooks();
  }, []);

  const fetchLoans = async (page = 1) => {
    try {
      const response = await loanApi.getAll(page);
      setLoans(Array.isArray(response.data.data) ? response.data.data : []);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        next_page_url: response.data.next_page_url,
        prev_page_url: response.data.prev_page_url
      });
      setError("");
    } catch (err) {
      setError(
        "Erro ao carregar empréstimos: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll();
      setUsers(Array.isArray(response.data.data) ? response.data.data : []); // Proteção extra
      setError("");
    } catch (err) {
      setError(
        "Erro ao carregar usuários: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await bookApi.getAll();
      const booksArray = Array.isArray(response.data.data) ? response.data.data : [];
      setBooks(booksArray.filter(
        (b) => b.status === "available" || b.status === "borrowed"
      ));
      setError("");
    } catch (err) {
      setError(
        "Erro ao carregar livros: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLoanData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await loanApi.create(newLoanData);
      setMessage("Empréstimo criado com sucesso!");
      setNewLoanData({
        user_id: "",
        book_id: "",
        loan_date: format(new Date(), "yyyy-MM-dd"),
        return_date: format(new Date(), "yyyy-MM-dd"),
        status: "available",
      });
      fetchLoans();
      fetchBooks();
    } catch (err) {
      setError(
        "Erro ao criar empréstimo: " +
          (err.response?.data?.message ||
            "Verifique os dados e a disponibilidade do livro.")
      );
    }
  };

  const handleReturnLoan = async (loanId) => {
    setMessage("");
    setError("");
    if (
      window.confirm(
        "Tem certeza que deseja marcar este empréstimo como devolvido?"
      )
    ) {
      try {
        const currentLoan = loans.find(l => l.id === loanId);
        if (!currentLoan) {
          setError("Empréstimo não encontrado.");
          return;
        }
        const updatedData = {
          user_id: currentLoan.user_id,
          book_id: currentLoan.book_id,
          loan_date: format(
            currentLoan.loan_date
              ? new Date(currentLoan.loan_date)
              : parseISO(currentLoan.created_at),
            "yyyy-MM-dd"
          ),
          return_date: format(
            new Date(currentLoan.devolution_date),
            "yyyy-MM-dd"
          ),
          status: "returned"
        };
        await loanApi.update(loanId, updatedData);
        setMessage("Empréstimo devolvido com sucesso!");
        fetchLoans();
        fetchBooks();
      } catch (err) {
        setError(
          "Erro ao devolver empréstimo: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const handleMarkAsOverdue = async (loanId) => {
    setMessage("");
    setError("");
    if (
      window.confirm(
        "Tem certeza que deseja marcar este empréstimo como atrasado?"
      )
    ) {
      try {
        const currentLoan = loans.find(l => l.id === loanId);
        if (!currentLoan) {
          setError("Empréstimo não encontrado.");
          return;
        }
        const updatedData = {
          user_id: currentLoan.user_id,
          book_id: currentLoan.book_id,
          loan_date: format(
            currentLoan.loan_date
              ? new Date(currentLoan.loan_date)
              : parseISO(currentLoan.created_at),
            "yyyy-MM-dd"
          ),
          return_date: format(
            new Date(currentLoan.devolution_date),
            "yyyy-MM-dd"
          ),
          status: "overdue"
        };
        await loanApi.update(loanId, updatedData);
        setMessage("Empréstimo marcado como atrasado!");
        fetchLoans();
      } catch (err) {
        setError(
          "Erro ao marcar como atrasado: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return dateString;
    }
  };


  const getBookAvailabilityForNewLoan = (book) => {
    if (book.status === "available") {
      return `${book.name} (Disponível)`;
    }
    if (book.status === "borrowed") {
      return `${book.name} (Emprestado)`;
    }
    return book.name;
  };

  return (
    <div style={styles.pageContainer}>
      <h2>Gerenciar Empréstimos</h2>
      <Message message={message} type="success" />
      <Message message={error} type="error" />

      <div style={styles.formSection}>
        <h3>Adicionar Novo Empréstimo</h3>
        <form onSubmit={handleCreateLoan} style={styles.formGrid}>
          <div>
            <label style={styles.label}>Usuário:</label>
            <select
              name="user_id"
              value={newLoanData.user_id}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            >
              <option value="">Selecione um Usuário</option>
              {(Array.isArray(users) ? users : []).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.label}>Status:</label>
            <select
              name="status"
              value={newLoanData.status}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            >
              <option value="pending">Pendente</option>
              <option value="returned">Devolvido</option>
              <option value="overdue">Atrasado</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>Livro:</label>
            <select
              name="book_id"
              value={newLoanData.book_id}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            >
              <option value="">Selecione um Livro</option>
              {(Array.isArray(books) ? books : []).filter((book) => book.status === "available").map((book) => (
                  <option key={book.id} value={book.id}>
                    {getBookAvailabilityForNewLoan(book)}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label style={styles.label}>Data do Empréstimo:</label>
            <input
              type="date"
              name="loan_date"
              value={newLoanData.loan_date}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            />
          </div>
          <div>
            <label style={styles.label}>Data de Devolução Prevista:</label>
            <input
              type="date"
              name="return_date"
              value={newLoanData.return_date}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            />
          </div>
          <div style={styles.formActions}>
            <button type="submit" style={styles.primaryButton}>
              Criar Empréstimo
            </button>
          </div>
        </form>
      </div>

      <h3 style={{ marginTop: "40px" }}>Lista de Empréstimos</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Usuário</th>
            <th style={styles.th}>Livro</th>
            <th style={styles.th}>Data Empréstimo</th>
            <th style={styles.th}>Data Devolução Prevista</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(loans) ? loans : []).length === 0 ? (
            <tr>
              <td colSpan="7" style={styles.tdCenter}>
                Nenhum empréstimo encontrado.
              </td>
            </tr>
          ) : (
            (Array.isArray(loans) ? loans : []).map((loan) => (
              <tr key={loan.id}>
                <td style={styles.td}>{loan.id}</td>
                <td style={styles.td}>{
                  loan.user ? loan.user.name : (users.find(u => u.id === loan.user_id)?.name || "N/A")
                }</td>
                <td style={styles.td}>{
                  loan.book ? loan.book.name : (books.find(b => b.id === loan.book_id)?.name || "N/A")
                }</td>
                <td style={styles.td}>{formatDateDisplay(loan.created_at)}</td>
                <td style={styles.td}>{formatDateDisplay(loan.devolution_date)}</td>
                <td style={styles.td}>
                  {loan.status === "pending" && "Pendente"}
                  {(loan.status === "returned" || loan.status === "devolvido") && "Devolvido"}
                  {loan.status === "overdue" && "Atrasado"}
                </td>
                <td style={styles.td}>
                {loan.status !== "returned" && (
                    <button
                      onClick={() => handleReturnLoan(loan.id)}
                      style={styles.returnButton}
                    >
                      Marcar como Devolvido
                    </button>
                  )}
                  
                  {loan.status !== "returned" && loan.status !== "overdue" && (
                    <button
                      onClick={() => handleMarkAsOverdue(loan.id)}
                      style={{
                        ...styles.returnButton,
                        backgroundColor: "#dc3545",
                        marginLeft: "5px",
                      }} 
                    >
                      Marcar como Atrasado
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Botões de paginação */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button
          onClick={() => fetchLoans(pagination.current_page - 1)}
          disabled={!pagination.prev_page_url}
          style={{ marginRight: 10 }}
        >
          Anterior
        </button>
        <span>Página {pagination.current_page} de {pagination.last_page}</span>
        <button
          onClick={() => fetchLoans(pagination.current_page + 1)}
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
  pageContainer: { padding: "20px" },
  formSection: {
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    backgroundColor: "#f9f9f9",
  },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  label: { marginBottom: "5px", display: "block", fontWeight: "bold" },
  inputField: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  formActions: { gridColumn: "span 2", textAlign: "right", marginTop: "10px" },
  primaryButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  th: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: { padding: "10px", border: "1px solid #ddd", textAlign: "left" },
  tdCenter: { padding: "10px", border: "1px solid #ddd", textAlign: "center" },
  returnButton: {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default LoansPage;
