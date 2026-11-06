# 📦 Sistema de Cadastro e Controle de Estoque de Produtos

Sistema Web Full Stack para gerenciamento, cadastro, edição e exclusão lógica (*soft delete*) de produtos em estoque, desenvolvido com **Node.js**, **Express**, **MySQL** e **HTML/CSS/JS** puro com **Axios**.

---

## 📋 Sumário
- [Recursos da Aplicação](#-recursos-da-aplicação)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Modelo do Banco de Dados](#-modelo-do-banco-de-dados)
- [Rotas da API (Backend)](#-rotas-da-api-backend)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
  - [1. Configurando o Banco de Dados](#1-configurando-o-banco-de-dados)
  - [2. Configurando o Backend](#2-configurando-o-backend)
  - [3. Executando o Frontend](#3-executando-o-frontend)
- [Licença](#-licença)

---

## 🚀 Recursos da Aplicação

- **Listagem Dinâmica:** Exibe produtos ativos cadastrados em formato de tabela.
- **Cadastro de Produtos:** Formulário com validação dos campos obrigatórios (nome, quantidade e preço).
- **Edição em Tempo Real:** Preenchimento automático do formulário ao clicar em "Editar", alternando para o modo de atualização (`PUT`).
- **Exclusão Lógica (Soft Delete):** Desativação do produto (`PATCH`), alterando o status `ativo` para `FALSE` sem apagar o registro do banco de dados.
- **Feedback Visual:** Exibição de alertas de sucesso ou erro durante as requisições.

---

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **Node.js** com **Express.js** (Servidor HTTP e API REST)
- **MySQL2** (Driver com suporte a Promises e Pool de Conexões)
- **dotenv** (Gerenciamento de variáveis de ambiente)
- **CORS** (Permissão para requisições cross-origin)

### **Frontend**
- **HTML5** & **CSS3** (Interface dinâmica e responsiva)
- **JavaScript (ES6+)** (Manipulação dinâmica do DOM)
- **Axios (via CDN)** (Cliente HTTP para integração com a API)

### **Banco de Dados**
- **MySQL** (Gerenciado via MySQL Workbench)

---

## 📂 Estrutura do Projeto

```text
├── backend/
│   ├── .env                 # Variáveis de ambiente (credenciais do DB e porta)
│   ├── db.js                # Conexão e pool com MySQL
│   ├── server.js            # Servidor Express e definição das rotas
│   ├── package.json         # Dependências do backend
│   └── package-lock.json
│
├── frontend/
│   ├── index.html           # Interface principal (Formulário + Tabela)
│   ├── style.css            # Estilização visual da página
│   └── app.js               # Regras de negócio do frontend e consumo da API
│
└── database/
    └── CRIACAO app_estoque.sql  # Script de criação do BD e tabelas
```

---

## 🗄️ Modelo do Banco de Dados

Script executado no **MySQL Workbench**:

```sql
CREATE DATABASE IF NOT EXISTS app_estoque;
USE app_estoque;

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    preco DECIMAL(10,2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 Rotas da API (Backend)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/produtos` | Retorna todos os produtos com `ativo = TRUE` em ordem decrescente de ID. |
| **POST** | `/api/produtos` | Cadastra um novo produto no estoque. |
| **PUT** | `/api/produtos/:id` | Atualiza as informações de um produto existente por ID. |
| **PATCH** | `/api/produtos/:id/desativar` | Realiza o *Soft Delete* alterando o campo `ativo` para `FALSE`. |

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) e [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- [Git](https://git-scm.com/) (opcional)

---

## 🔧 Instalação e Configuração

### 1. Configurando o Banco de Dados
1. Abra o **MySQL Workbench**.
2. Abra e execute o arquivo de script `CRIACAO app_estoque.sql` ou cole os comandos SQL descritos no modelo do banco de dados para criar o schema `app_estoque` e a tabela `produtos`.

### 2. Configurando o Backend
1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências executando:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz da pasta `backend/` com as suas configurações locais:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=suasenha
   DB_NAME=app_estoque
   DB_PORT=3306
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
   > O servidor iniciará na porta `3000`: `http://localhost:3000`

### 3. Executando o Frontend
1. Navegue até a pasta `frontend/`.
2. Abra o arquivo `index.html` diretamente no navegador ou utilize a extensão **Live Server** do VS Code.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e práticos. Sinta-se à vontade para modificar e aprimorar!