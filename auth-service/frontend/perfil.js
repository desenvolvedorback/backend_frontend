// Instância do Axios apontando para o microsserviço de autenticação
const authApi = axios.create({
  baseURL: 'http://localhost:3007/api/auth'
});

// Elementos da interface
const formPerfil = document.getElementById('formPerfil');
const inputNome = document.getElementById('nome');
const inputSobrenome = document.getElementById('sobrenome');
const inputEmail = document.getElementById('email');
const inputFoto = document.getElementById('foto');
const previewFoto = document.getElementById('previewFoto');
const statusMensagem = document.getElementById('statusMensagem');
const btnSalvar = document.getElementById('btnSalvar');

// Imagem padrão caso o usuário não possua foto cadastrada
const IMAGEM_PADRAO = 'https://i.pinimg.com/474x/57/54/4f/57544f26d902645c85b783ba1e9643e1.jpg';

// -------------------------------------------------------------
// 1. OBTENÇÃO DO ID DO USUÁRIO VIA URL (?id=X)
// -------------------------------------------------------------
// verificação de sessão
const dadosSessao = sessionStorage.getItem("usuarioLogado")

if (!dadosSessao) {
  window.location.replace("login.html")
}

const usuarioLogado = JSON.parse(dadosSessao)
const usuarioId = usuarioLogado.id

// Exibe avisos visuais na tela
function exibirFeedback(texto, sucesso = true) {
  if (!statusMensagem) return;
  statusMensagem.style.display = 'block';
  statusMensagem.style.backgroundColor = sucesso ? '#d4edda' : '#f8d7da';
  statusMensagem.style.color = sucesso ? '#155724' : '#721c24';
  statusMensagem.textContent = texto;
  setTimeout(() => {
    statusMensagem.style.display = 'none';
  }, 4000);
}

// -------------------------------------------------------------
// 2. CARREGAR DADOS DO PERFIL (GET)
// -------------------------------------------------------------
async function carregarPerfil() {
  if (!usuarioId) {
    exibirFeedback('ID do usuário não informado na URL (ex: index.html?id=1).', false);
    if (btnSalvar) btnSalvar.disabled = true;
    return;
  }

  try {
    const response = await authApi.get(`/perfil/${usuarioId}`);
    const usuario = response.data;

    // Preenche os campos do formulário
    inputNome.value = usuario.nome || '';
    inputSobrenome.value = usuario.sobrenome || '';
    inputEmail.value = usuario.email || '';

    // Renderiza a foto em Base64 ou o placeholder padrão
    previewFoto.src = usuario.foto ? usuario.foto : IMAGEM_PADRAO;

  } catch (error) {
    const msg = error.response?.data?.erro || 'Erro ao carregar dados do perfil.';
    exibirFeedback(msg, false);
    previewFoto.src = IMAGEM_PADRAO;
  }
}

// -------------------------------------------------------------
// 3. PRÉ-VISUALIZAÇÃO IMEDIATA DA IMAGEM SELECIONADA
// -------------------------------------------------------------
inputFoto.addEventListener('change', () => {
  const arquivo = inputFoto.files[0];
  if (arquivo) {
    // Gera uma URL temporária em memória para exibir no <img> antes de salvar
    previewFoto.src = URL.createObjectURL(arquivo);
  }
});

// -------------------------------------------------------------
// 4. ATUALIZAÇÃO DOS DADOS E ENVIO DA FOTO VIA FORMDATA (PUT)
// -------------------------------------------------------------
formPerfil.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!usuarioId) {
    exibirFeedback('Operação cancelada: ID de usuário ausente.', false);
    return;
  }

  // Criação do objeto FormData para envio de multipart/form-data
  const formData = new FormData();
  formData.append('nome', inputNome.value.trim());
  formData.append('sobrenome', inputSobrenome.value.trim());

  // Anexa o arquivo binário apenas se um novo arquivo foi escolhido
  const arquivoSelecionado = inputFoto.files[0];
  if (arquivoSelecionado) {
    formData.append('foto', arquivoSelecionado);
  }

  try {
    if (btnSalvar) btnSalvar.disabled = true;

    // O Axios configura automaticamente o Content-Type: multipart/form-data com o boundary
    const response = await authApi.put(`/perfil/${usuarioId}`, formData);

    exibirFeedback(response.data.mensagem || 'Perfil atualizado com sucesso!', true);

    usuarioLogado.nome = `${inputNome.value.trim()} ${inputSobrenome.value.trim()}`
    sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado))

    // Limpa a seleção do input de arquivo e recarrega os dados persistidos
    inputFoto.value = '';
    await carregarPerfil();

  } catch (error) {
    const msg = error.response?.data?.erro || 'Erro ao atualizar informações do perfil.';
    exibirFeedback(msg, false);
  } finally {
    if (btnSalvar) btnSalvar.disabled = false;
  }
});

// Executa a leitura inicial ao abrir a página
carregarPerfil();