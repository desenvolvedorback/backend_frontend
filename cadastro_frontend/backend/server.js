require('dotenv').config();

const express = require('express');
const cors = require('cors'); // permite o envio de informações de diferentes servidorres (frontend e backend)
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. GET: Listar apenas pessoas ativas
app.get('/api/pessoas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pessoas WHERE ativo = TRUE ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Falha ao buscar pessoas.' });
  }
});

// 2. POST: Cadastrar nova pessoa
app.post('/api/pessoas', async (req, res) => {
  const { nome, email, telefone } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO pessoas (nome, email, telefone, ativo) VALUES (?, ?, ?, TRUE)',
      [nome, email, telefone || null]
    );
    res.status(201).json({ id: result.insertId, nome, email, telefone });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Este email já está cadastrado.' });
    }
    res.status(500).json({ erro: 'Falha ao cadastrar pessoa.' });
  }
});

// 3. PUT: Atualizar dados de uma pessoa
app.put('/api/pessoas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE pessoas SET nome = ?, email = ?, telefone = ? WHERE id = ?',
      [nome, email, telefone || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Pessoa não encontrada.' });
    }
    res.json({ mensagem: 'Cadastro atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Falha ao atualizar dados.' });
  }
});

// 4. PATCH: Soft delete (desativação lógica)
app.patch('/api/pessoas/:id/desativar', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE pessoas SET ativo = FALSE WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Pessoa não encontrada.' });
    }
    res.json({ mensagem: 'Pessoa desativada com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Falha ao desativar registro.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
████  █   █    ████   ███  █   █ ███    █     █████  ███  █   █  ███  ████  ████   ███  
█   █  █ █     █   █ █   █ █   █  █     █     █     █   █ ██  █ █   █ █   █ █   █ █   █ 
████    █      █   █ █████ █   █  █     █     ████  █   █ █ █ █ █████ ████  █   █ █   █ 
█   █   █      █   █ █   █  █ █   █     █     █     █   █ █  ██ █   █ █  █  █   █ █   █ 
████    █      ████  █   █   █   ███    █████ █████  ███  █   █ █   █ █   █ ████   ███  
    `)
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});