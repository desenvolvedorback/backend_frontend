const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Elementos da interface
const formproduto = document.getElementById('formproduto');
const inputId = document.getElementById('produtoId');
const inputrazao_social = document.getElementById('razao_social');
const inputcnpj = document.getElementById('cnpj');
const inputcontato = document.getElementById('contato');
const inputtelefone = document.getElementById('telefone');
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

// 1. GET: Carregar e renderizar fornecedores ativos
async function listarfornecedores() {
  try {
    const response = await api.get('/fornecedores');
    tabelaCorpo.innerHTML = '';

    response.data.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.razao_social}</td>
        <td>${p.cnpj}</td>
        <td>${p.contato}</td>
        <td>${p.telefone}</td>
        <td>
          <button class="btn-edit" onclick="prepararEdicao('${p.id}', '${p.razao_social}', '${p.cnpj}', '${p.contato}', '${p.telefone}')">Editar</button>
          <button class="btn-delete" onclick="desativarproduto(${p.id})">Desativar</button>
        </td>
      `;
      tabelaCorpo.appendChild(tr);
    });
  } catch (error) {
    const msg = error.response?.data?.erro || 'Erro ao carregar Fornecedores.';
    exibirFeedback(msg, false);
  }
}

// 2. POST / PUT: Salvar cadastro (novo ou atualização)
formproduto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = inputId.value;
  const payload = {
  razao_social: inputrazao_social.value,
  cnpj: inputcnpj.value,
  contato: inputcontato.value,
  telefone: inputtelefone.value
};

  try {
    if (id) {
      // PUT: Atualização
      await api.put(`/fornecedores/${id}`, payload);
      exibirFeedback('Fornecedor atualizado com sucesso!');
    } else {
      // POST: Novo cadastro
      await api.post('/fornecedores', payload);
      exibirFeedback('Fornecedor cadastrado com sucesso!');
    }
    resetarFormulario();
    listarfornecedores();
  } catch (error) {
    const msg = error.response?.data?.erro || 'Erro ao salvar dados.';
    exibirFeedback(msg, false);
  }
});

// 3. PATCH: Soft Delete - Desativando uma produto
window.desativarproduto = async function(id) {
  if (!confirm('Deseja realmente desativar este fornecedor?')) return;

  try {
    const response = await api.patch(`/fornecedores/${id}/desativar`);
    exibirFeedback(response.data.mensagem);
    listarfornecedores();
  } catch (error) {
    const msg = error.response?.data?.erro || 'Erro ao desativar fornecedor.';
    exibirFeedback(msg, false);
  }
};

// Preparação e Reset do formulário
window.prepararEdicao = function(id, razao_social, cnpj, contato, telefone) { 
  inputId.value = id;
  inputrazao_social.value = razao_social;
  inputcnpj.value = cnpj;
  inputcontato.value = contato;
  inputtelefone.value = telefone;
  btnSalvar.textContent = 'Atualizar';
  btnCancelar.style.display = 'inline-block';
};

function resetarFormulario() {
  inputId.value = '';
  formproduto.reset();
  btnSalvar.textContent = 'Cadastrar';
  btnCancelar.style.display = 'none';
}

btnCancelar.addEventListener('click', resetarFormulario);

// Carregamento inicial
listarfornecedores();