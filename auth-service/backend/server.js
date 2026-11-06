require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');
const multer = require("multer")

const app = express();
app.use(cors());
app.use(express.json());

// ROTA: CADASTRO DE NOVO USUÁRIO
app.post('/api/auth/cadastro', async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;

  // Validação básica dos dados recebidos
  if (!nome || !sobrenome || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve conter no mínimo 6 caracteres.' });
  }

  try {
    // 1. Criptografa a senha antes de persistir
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 2. Insere no banco
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)',
      [nome, sobrenome, email.toLowerCase().trim(), senhaHash]
    );

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuarioId: result.insertId
    });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }
    res.status(500).json({ erro: 'Erro interno ao realizar cadastro.' });
  }
});

// ROTA: LOGIN DE USUÁRIO
app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe o e-mail e a senha.' });
  }

  try {
    // 1. Busca usuário pelo e-mail
    const [rows] = await db.query(
      'SELECT id, nome, sobrenome, email, senha, ativo FROM usuarios WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas (usuário não encontrado).' });
    }

    const usuario = rows[0];

    // Verifica se a conta está ativa (soft delete)
    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Conta de usuário desativada.' });
    }

    // 2. Compara a senha digitada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas (senha incorreta).' });
    }

    // 3. Sucesso no login
    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: `${usuario.nome} ${usuario.sobrenome}`,
        email: usuario.email
      }
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno ao processar login.' });
  }
});

// inserindo a logica para lidar com foto utilizando o multer
// Configura o Multer para manter o arquivo em memória temporária (Buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  // limits: { fileSize: 2 * 1024 * 1024 } // Limite didático de 2MB
});

// =====================================================================
// ROTA: BUSCAR DADOS DO PERFIL (GET)
// =====================================================================
app.get('/api/auth/perfil/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT id, nome, sobrenome, email, foto FROM usuarios WHERE id = ? AND ativo = TRUE',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    const usuario = rows[0];

    // Converte os bytes do LONGBLOB para Base64 para exibir na tag <img>
    let fotoBase64 = null;
    if (usuario.foto) {
      fotoBase64 = `data:image/jpeg;base64,${usuario.foto.toString('base64')}`;
    }

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      foto: fotoBase64
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar dados do perfil.' });
  }
});

// =====================================================================
// ROTA: ATUALIZAR PERFIL E/OU FOTO (PUT)
// =====================================================================
app.put('/api/auth/perfil/:id', upload.single('foto'), async (req, res) => {
  const { id } = req.params;
  const { nome, sobrenome } = req.body;
  const arquivoFoto = req.file; // Contém o buffer se uma nova foto foi enviada

  if (!nome || !sobrenome) {
    return res.status(400).json({ erro: 'Nome e sobrenome são obrigatórios.' });
  }

  try {
    if (arquivoFoto) {
      // Atualiza nome, sobrenome E a nova foto
      await db.query(
        'UPDATE usuarios SET nome = ?, sobrenome = ?, foto = ? WHERE id = ?',
        [nome, sobrenome, arquivoFoto.buffer, id]
      );
    } else {
      // Mantém a foto anterior se o aluno não escolheu novo arquivo
      await db.query(
        'UPDATE usuarios SET nome = ?, sobrenome = ? WHERE id = ?',
        [nome, sobrenome, id]
      );
    }

    res.json({ mensagem: 'Perfil atualizado com sucesso!' });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar informações do perfil.' });
  }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`[Microsserviço de Auth] Rodando na porta http:localhost:${PORT}`);
}); 