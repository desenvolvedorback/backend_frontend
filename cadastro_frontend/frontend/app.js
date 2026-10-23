const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Elementos da interface
const formPessoa = document.getElementById('formPessoa');
const inputId = document.getElementById('pessoaId');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputTelefone = document.getElementById('telefone');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const tabelaCorpo = document.getElementById('tabelaCorpo');
const statusMensagem = document.getElementById('statusMensagem');

function exibirFeedback(texto, sucesso = true) {
  statusMensagem.style.display = 'block';
  statusMensagem.style.backgroundColor = sucesso ? '#d4edda' : '#f8d7da';
  statusMensagem.style.color = sucesso ? '#155724' : '#721c24';
  statusMensagem.textContent = texto;
  setTimeout(() => { statusMensagem.style.display = 'none'; }, 3500);
}

// 1. GET: Carregar e renderizar pessoas ativas
async function listarPessoas() {
  try {
    const response = await api.get('/pessoas');
    tabelaCorpo.innerHTML = '';

    response.data.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.nome}</td>
        <td>${p.email}</td>
        <td>${p.telefone || '-'}</td>
        <td>
          <button class="btn-edit" onclick="prepararEdicao(${p.id}, '${p.nome}', '${p.email}', '${p.telefone || ''}')">Editar</button>
          <button class="btn-delete" onclick="desativarPessoa(${p.id})">Desativar</button>
        </td>
      `;
      tabelaCorpo.appendChild(tr);
    });
  } catch (error) {
    const msg = error.response?.data?.erro || 'Erro ao carregar pessoas.';
    exibirFeedback(msg, false);
  }
}

// 2. POST / PUT: Salvar cadastro (novo ou atualização)
formPessoa.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = inputId.value;
  const payload = {
    nome: inputNome.value,
    email: inputEmail.value,
    telefone: inputTelefone.value
  };

  try {
    if (id) {
      // PUT: Atualização
      await api.put(`/pessoas/${id}`, payload);
      exibirFeedback('Pessoa atualizada com sucesso!');
    } else {
      // POST: Novo cadastro
      await api.post('/pessoas', payload);
      exibirFeedback('Pessoa cadastrada com sucesso!');
    }
    resetarFormulario();
    listarPessoas();
  } catch (error) {
    const msg = error.response?.data?.erro || 'Erro ao salvar dados.';
    exibirFeedback(msg, false);
  }
});

// 3. PATCH: Soft Delete - Desativando uma pessoa
window.desativarPessoa = async function(id) {
  if (!confirm('Deseja realmente desativar este cadastro?')) return;

  try {
    const response = await api.patch(`/pessoas/${id}/desativar`);
    exibirFeedback(response.data.mensagem);
    listarPessoas();
  } catch (error) {
    const msg = error.response?.data?.erro || 'Erro ao desativar cadastro.';
    exibirFeedback(msg, false);
  }
};

// Preparação e Reset do formulário
window.prepararEdicao = function(id, nome, email, telefone) {
  inputId.value = id;
  inputNome.value = nome;
  inputEmail.value = email;
  inputTelefone.value = telefone;
  btnSalvar.textContent = 'Atualizar';
  btnCancelar.style.display = 'inline-block';
};

function resetarFormulario() {
  inputId.value = '';
  formPessoa.reset();
  btnSalvar.textContent = 'Cadastrar';
  btnCancelar.style.display = 'none';
}

btnCancelar.addEventListener('click', resetarFormulario);

// Carregamento inicial
listarPessoas();