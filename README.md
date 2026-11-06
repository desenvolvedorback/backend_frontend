# Backend Frontend

Repositório que reúne três aplicações web desenvolvidas com **Node.js, Express, MySQL, HTML, CSS e JavaScript**. Cada aplicação possui seu próprio backend, frontend e configuração de banco de dados.

> **Importante:** este repositório é uma coleção de projetos independentes dentro de uma única estrutura Git. Os backends devem ser instalados e executados separadamente.

## Projetos

| Diretório | Descrição | Backend padrão | Banco de dados |
|---|---|---:|---|
| [`auth-service/`](./auth-service/) | Cadastro, login e gerenciamento básico de perfil de usuários. | `3007` | `app_estoque` |
| [`cadastro_frontend/`](./cadastro_frontend/) | Cadastro, listagem, edição e desativação lógica de pessoas. | `3004` | `app_cadastro` |
| [`cadastro_produto/`](./cadastro_produto/) | Cadastro e gerenciamento de produtos e fornecedores. | `3000` | `app_estoque` |

## Estrutura

```text
backend_frontend/
├── auth-service/
│   ├── backend/
│   └── frontend/
├── cadastro_frontend/
│   ├── backend/
│   └── frontend/
├── cadastro_produto/
│   ├── backend/
│   └── frontend/
├── .gitignore
└── README.md
```

## Tecnologias

- **Backend:** Node.js, Express e JavaScript.
- **Banco de dados:** MySQL, acessado por `mysql2`.
- **Configuração:** variáveis de ambiente com `dotenv`.
- **Comunicação:** APIs HTTP/REST com respostas JSON e CORS.
- **Frontend:** HTML5, CSS3 e JavaScript; Axios é utilizado nas interfaces que consomem as APIs.

## Pré-requisitos

Instale antes de executar os projetos:

- [Node.js](https://nodejs.org/) e npm;
- [MySQL Server](https://dev.mysql.com/downloads/mysql/);
- opcionalmente, [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) para executar e administrar os scripts SQL;
- um navegador e, para servir as interfaces localmente, uma ferramenta como a extensão Live Server do VS Code.

## Configuração e execução

Cada aplicação possui seu próprio `package.json`. Portanto, execute os comandos na pasta `backend` correspondente.

### 1. Microsserviço de autenticação — `auth-service`

**Banco de dados:** execute `auth-service/backend/atualização tabela.sql` no MySQL. O script utiliza o schema `app_estoque` e cria a tabela `usuarios`.

**Backend:**

```powershell
cd auth-service/backend
npm install
```

Crie um arquivo `.env` nessa pasta:

```env
PORT=3007
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=app_estoque
DB_PORT=3306
```

Inicie o servidor:

```powershell
npm start
```

O backend fica disponível, por padrão, em `http://localhost:3007`. Para desenvolvimento com reinicialização automática, use `npm run dev`.

**Frontend:** abra `auth-service/frontend/login.html` ou `auth-service/frontend/cadastro.html` em um servidor estático local. O arquivo `auth-service/frontend/auth.js` está configurado para consumir `http://localhost:3007/api/auth`.

### 2. Cadastro de pessoas — `cadastro_frontend`

**Banco de dados:** execute `cadastro_frontend/backend/criação app_cadastro.sql`. O script cria o schema `app_cadastro` e a tabela `pessoas`, incluindo alguns registros de demonstração.

**Backend:**

```powershell
cd cadastro_frontend/backend
npm install
```

Crie `cadastro_frontend/backend/.env`:

```env
PORT=3004
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=app_cadastro
DB_PORT=3306
```

Inicie o servidor:

```powershell
npm start
```

O backend utiliza a porta `3004` por padrão e disponibiliza as rotas `/api/pessoas`.

**Frontend:** abra `cadastro_frontend/frontend/index.html` em um servidor estático local. **Atenção:** no código recebido, o `server.js` usa a porta `3004`, mas o `frontend/app.js` está configurado para `http://localhost:3000/api`. Para conectar corretamente na configuração padrão, altere a `baseURL` do frontend para:

```javascript
baseURL: 'http://localhost:3004/api'
```

Se preferir manter a URL atual do frontend, será necessário alterar a porta do backend para `3000` — mas essa porta já é utilizada pelo projeto `cadastro_produto` quando os dois estão ativos ao mesmo tempo.

### 3. Cadastro de produtos e fornecedores — `cadastro_produto`

**Banco de dados:** execute `cadastro_produto/backend/CRIACAO app_estoque.sql` no MySQL. O script cria o schema `app_estoque` e as tabelas `produtos` e `fornecedores`.

**Backend:**

```powershell
cd cadastro_produto/backend
npm install
```

Crie `cadastro_produto/backend/.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=app_estoque
DB_PORT=3306
```

Inicie o servidor:

```powershell
npm start
```

O backend fica disponível em `http://localhost:3000`.

**Frontend:** abra `cadastro_produto/frontend/index.html` em um servidor estático local. O frontend está configurado para consumir a API em `http://localhost:3000/api`.

## Endpoints disponíveis

### Autenticação (`auth-service`)

| Método | Rota | Finalidade |
|---|---|---|
| `POST` | `/api/auth/cadastro` | Cadastrar usuário |
| `POST` | `/api/auth/login` | Autenticar usuário |
| `GET` | `/api/auth/perfil/:id` | Consultar perfil, conforme implementação do servidor |
| `PUT` | `/api/auth/perfil/:id` | Atualizar dados e, opcionalmente, foto do perfil |

### Pessoas (`cadastro_frontend`)

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/api/pessoas` | Listar pessoas ativas |
| `POST` | `/api/pessoas` | Cadastrar pessoa |
| `PUT` | `/api/pessoas/:id` | Atualizar pessoa |
| `PATCH` | `/api/pessoas/:id/desativar` | Desativar pessoa logicamente |

### Produtos e fornecedores (`cadastro_produto`)

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/api/produtos` | Listar produtos ativos |
| `POST` | `/api/produtos` | Cadastrar produto |
| `PUT` | `/api/produtos/:id` | Atualizar produto |
| `PATCH` | `/api/produtos/:id/desativar` | Desativar produto logicamente |
| `GET` | `/api/fornecedores` | Listar fornecedores ativos |
| `POST` | `/api/fornecedores` | Cadastrar fornecedor |
| `PUT` | `/api/fornecedores/:id` | Atualizar fornecedor |
| `PATCH` | `/api/fornecedores/:id/desativar` | Desativar fornecedor logicamente |

## Executando mais de um projeto ao mesmo tempo

Os três backends usam portas padrão diferentes (`3007`, `3004` e `3000`), então podem ser iniciados em terminais separados. Confira sempre se os valores de `PORT` nos arquivos `.env` correspondem às URLs configuradas nos respectivos frontends.

Exemplo: abra três terminais, um em cada diretório `backend`, instale as dependências e execute `npm start` em cada um.

## Segurança e configuração

No `.gitignore` da raiz, mantenha pelo menos estas regras para impedir que arquivos locais e credenciais sejam adicionados ao repositório:

```gitignore
**/node_modules/
**/.env
**/.env.*
!**/.env.example
**/*.log
.DS_Store
Thumbs.db
```

- **Nunca envie arquivos `.env` ao GitHub.** Eles podem conter senhas e credenciais do banco de dados.
- Mantenha `node_modules/` fora do versionamento; cada pessoa deve executar `npm install` localmente.
- Use senhas próprias e fortes para o MySQL e não reutilize credenciais reais em exemplos.
- Se algum `.env` com credenciais reais já tiver sido enviado ao GitHub, remova-o do controle de versão e troque imediatamente as credenciais expostas. Apagar o arquivo em um commit posterior não remove o segredo do histórico Git.
- Antes de publicar qualquer aplicação, restrinja o CORS às origens necessárias, utilize HTTPS e revise autenticação, autorização, validação de dados e tratamento de erros.
- Os projetos são independentes: embora `auth-service` e `cadastro_produto` usem o schema `app_estoque`, eles criam tabelas diferentes nesse banco. Faça backup antes de executar scripts em um banco que já contenha dados.

## Desenvolvimento

Este repositório reúne projetos em evolução e estudo. Os scripts `test` presentes nos `package.json` ainda não representam uma suíte automatizada de testes. Valide as rotas e os fluxos no ambiente local antes de utilizar os sistemas com dados reais.

## Licença

Nenhuma licença geral foi definida para este repositório. Até que uma licença seja adicionada, todos os direitos permanecem reservados aos respectivos autores.
