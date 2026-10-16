PROJETO: CADASTRO DE PESSOAS
Conceito estudado: Ligação do backend com o frontend

1. SOBRE O PROJETO

Este projeto foi desenvolvido para estudar como o frontend se comunica com o backend de uma aplicação web. O sistema permite cadastrar, listar, editar e desativar registros de pessoas.

O frontend é responsável pela interface exibida ao usuário. O backend recebe as requisições, valida os dados e realiza as operações no banco de dados MySQL. A comunicação entre as duas partes é feita por meio de uma API HTTP, utilizando requisições e respostas no formato JSON.

2. TECNOLOGIAS UTILIZADAS

Frontend:
- HTML5: estrutura da página.
- CSS3: estilização da interface.
- JavaScript: comportamento e interação com a API.
- Axios: envio de requisições HTTP ao backend.

Backend:
- Node.js: ambiente de execução do JavaScript.
- Express: criação do servidor e das rotas da API.
- MySQL: armazenamento dos registros.
- mysql2: conexão e execução de consultas SQL.
- dotenv: carregamento das configurações a partir de variáveis de ambiente.
- CORS: permite configurar a comunicação entre origens diferentes.

3. ESTRUTURA DO PROJETO

cadastro_frontend/
|
|-- backend/
|   |-- server.js       # Servidor Express e rotas da API
|   |-- db.js           # Configuração da conexão com MySQL
|   |-- package.json    # Dependências e comandos do backend
|   |-- .env            # Configurações locais e credenciais
|   |-- cria...sql      # Script SQL para criação do banco/tabela
|
|-- frontend/
    |-- index.html      # Estrutura da interface
    |-- style.css       # Estilos da página
    |-- app.js          # Lógica do frontend e chamadas à API

Observação: o arquivo .env contém configurações locais e não deve ser publicado no GitHub. Use um arquivo .env.example sem senhas reais para documentar as variáveis necessárias.

4. COMO A COMUNICAÇÃO FUNCIONA

1. O usuário realiza uma ação na página, como cadastrar ou editar uma pessoa.
2. O JavaScript do frontend reúne os dados do formulário.
3. O Axios envia uma requisição HTTP para a rota correspondente da API.
4. O backend Express recebe a requisição e executa a lógica necessária.
5. O backend consulta ou altera os dados no MySQL.
6. O servidor devolve uma resposta JSON com os dados ou uma mensagem de resultado.
7. O frontend interpreta a resposta e atualiza a tabela ou exibe uma mensagem ao usuário.

Fluxo resumido:
Usuário -> Frontend (HTML/CSS/JavaScript) -> Axios -> API Express -> MySQL
Usuário <- Frontend <- Resposta JSON <- API Express <- MySQL

5. ROTAS DA API

GET /api/pessoas
Lista os registros ativos, ordenados do mais recente para o mais antigo.

POST /api/pessoas
Cadastra uma pessoa. Os campos nome e email são obrigatórios; telefone é opcional.

PUT /api/pessoas/:id
Atualiza os dados de uma pessoa identificada pelo ID.

PATCH /api/pessoas/:id/desativar
Desativa logicamente um registro, alterando seu campo ativo para falso. O registro não é apagado fisicamente do banco.

6. COMO EXECUTAR O PROJETO

Pré-requisitos:
- Node.js e npm instalados.
- MySQL instalado e em execução.
- Banco de dados e tabela configurados conforme o script SQL do projeto.

Passo 1 — Configurar o banco:
- Abra o MySQL.
- Execute o script SQL disponibilizado na pasta backend para criar o banco e a tabela necessários.
- Confira se os nomes das tabelas e colunas correspondem às consultas utilizadas em server.js.

Passo 2 — Configurar as variáveis de ambiente:
Na pasta backend, crie ou configure um arquivo chamado .env com os dados da sua instalação MySQL:

DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
DB_PORT=3306
PORT=3000

Substitua os valores de exemplo pelos dados corretos do seu ambiente. Não compartilhe nem envie o arquivo .env ao GitHub.

Passo 3 — Instalar as dependências:
Abra um terminal dentro da pasta backend e execute:

npm install

Passo 4 — Iniciar o backend:
Ainda na pasta backend, execute:

npm start

O servidor deverá informar que está rodando em http://localhost:3000. Se houver erro de conexão com o banco, confira as variáveis do .env, o serviço MySQL e a existência do banco e da tabela.

Passo 5 — Abrir o frontend:
Abra o arquivo frontend/index.html no navegador. Para um ambiente de desenvolvimento mais próximo de uma aplicação real, também é possível servir a pasta frontend com uma extensão de servidor local, como Live Server, no VS Code.

O frontend está configurado para acessar a API em http://localhost:3000/api. Se o backend estiver em outra URL ou porta, atualize a propriedade baseURL no arquivo frontend/app.js.

7. VALIDAÇÕES E RESPOSTAS

- Nome e email são obrigatórios no cadastro.
- O backend responde com código 201 quando um registro é criado.
- O código 400 indica dados obrigatórios ausentes.
- O código 404 indica que o registro solicitado não foi encontrado.
- O código 409 indica que o email já está cadastrado, quando essa restrição de unicidade existe no banco.
- O código 500 indica uma falha interna ao processar a operação.

8. CONCEITOS APRENDIDOS

- Separação entre frontend e backend.
- Comunicação cliente-servidor por HTTP.
- Criação e consumo de uma API REST.
- Uso dos métodos GET, POST, PUT e PATCH.
- Envio e recebimento de dados em JSON.
- Manipulação de formulários com JavaScript.
- Uso do Axios para consumir endpoints.
- Integração do Node.js/Express com MySQL.
- Uso de variáveis de ambiente para configurações.
- Validação de dados e tratamento de erros.
- Desativação lógica de registros (soft delete).

9. OBSERVAÇÕES DE SEGURANÇA

- Nunca publique credenciais do banco, tokens ou outros segredos.
- Mantenha o arquivo .env fora do controle de versão.
- Em produção, restrinja o CORS às origens necessárias.
- Evite inserir dados recebidos do usuário diretamente no HTML sem tratamento. Prefira criar elementos e preencher seus valores com textContent.
- Para um sistema real, implemente autenticação, autorização, validação completa dos dados e tratamento adequado de erros.

Projeto de estudo — Ligação do backend com o frontend.
