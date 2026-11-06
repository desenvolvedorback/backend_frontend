require('dotenv').config();

const express = require('express');
const cors = require('cors'); // permite o envio de informações de diferentes servidorres (frontend e backend)
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. GET: Listar apenas produtos ativas
app.get('/api/produtos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM produtos WHERE ativo = TRUE ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Falha ao buscar produtos.' });
  }
});

// 1. GET: Listar apenas produtos ativas
app.get('/api/fornecedores', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM fornecedores WHERE ativo = TRUE ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Falha ao buscar Fornecedores.' });
  }
});

// 2. POST: Cadastrar nova produto
app.post('/api/produtos', async (req, res) => {
  const { nome, descricao, quantidade , preco } = req.body;
  if (!nome || !descricao) {
    return res.status(400).json({ erro: 'Nome e descricao são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO produtos (nome, descricao, quantidade, preco, ativo) VALUES (?, ?, ?, ?, TRUE)',
      [nome, descricao || null, quantidade, preco]
    );
    res.status(201).json({ id: result.insertId, nome, descricao, quantidade, preco });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Este descricao já está cadastrado.' });
    }
    res.status(500).json({ erro: 'Falha ao cadastrar produto.' });
  }
});

// 2. POST: Cadastrar nova produto
app.post('/api/fornecedores', async (req, res) => {
  const { razao_social, cnpj, contato, telefone } = req.body;
  if (!razao_social || !cnpj || !contato || !telefone) {
    return res.status(400).json({ erro: 'Razão social, CNPJ e contato são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO fornecedores (razao_social, cnpj, contato, telefone, ativo) VALUES (?, ?, ?, ?, TRUE)',
      [razao_social, cnpj, contato, telefone]
    );
    res.status(201).json({ id: result.insertId, razao_social, cnpj, contato, telefone });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Este CNPJ já está Forenecedor.' });
    }
    res.status(500).json({ erro: 'Falha ao cadastrar Fornecedor.' });
  }
});
  

// 3. PUT: Atualizar dados de uma produto
app.put('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, quantidade , preco } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE produtos SET nome = ?, descricao = ?, quantidade = ?, preco = ? WHERE id = ?',
      [nome, descricao || null, quantidade, preco, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'produto não encontrada.' });
    }
    res.json({ mensagem: 'Cadastro atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Falha ao atualizar dados.' });
    console.log(err);
  }
});


 // 3. PUT: Atualizar dados de um fornecedor
app.put('/api/fornecedores/:id', async (req, res) => {
  const { id } = req.params;
  const { razao_social, cnpj, contato, telefone } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE fornecedores
       SET razao_social = ?, cnpj = ?, contato = ?, telefone = ?
       WHERE id = ?`,
      [razao_social, cnpj, contato, telefone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        erro: 'Fornecedor não encontrado.'
      });
    }

    return res.json({
      mensagem: 'Fornecedor atualizado com sucesso.'
    });

  } catch (err) {
    console.error('Erro ao atualizar fornecedor:', err);

    return res.status(500).json({
      erro: 'Falha ao atualizar dados.'
    });
  }
});


// 4. PATCH: Soft delete (desativação lógica)
app.patch('/api/produtos/:id/desativar', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE produtos SET ativo = FALSE WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'produto não encontrada.' });
    }
    res.json({ mensagem: 'produto desativada com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Falha ao desativar registro.' });
  }
});

// 4. PATCH: Soft delete (desativação lógica)
app.patch('/api/fornecedores/:id/desativar', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE fornecedores SET ativo = FALSE WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Fornecedor não encontrada.' });
    }
    res.json({ mensagem: 'Fornecedor desativado com sucesso.' });
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