# Sistema de Gerenciamento de Biblioteca – Frontend

Este projeto é o frontend do sistema de gerenciamento de biblioteca, desenvolvido em React.

## Pré-requisitos

- **Node.js** (v14 ou superior)
- **npm** (v6 ou superior)
- **Backend da API** rodando (Laravel ou outro, conforme sua configuração)

---

## 1. Clonando o Projeto

Clone este repositório:

```bash
git clone <url-do-repositorio-frontend>
cd gerenciamento-biblioteca-front
```

---

## 2. Instalando as Dependências

Execute o comando abaixo para instalar as dependências do projeto:

```bash
npm install
```

---

## 3. Configurando a URL da API

Verifique se o arquivo `src/api/index.js` está apontando para a URL correta do backend da API (exemplo: `http://localhost:8000/api`).

---

## 4. Executando o Frontend

Inicie o servidor de desenvolvimento React:

```bash
npm start
```

O frontend estará disponível em `http://localhost:3000`.

---

## 5. Observações

- O frontend se comunica com o backend via API RESTful.
