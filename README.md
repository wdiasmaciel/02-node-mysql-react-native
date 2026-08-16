# Banco de Dados: Node + MySQL + React Native

Nós vamos utilizar o **GitHub Codespaces** para realizar as nossas práticas. Isso significa que você não precisa instalar programas no seu computador pessoal. Tudo vai rodar diretamente no seu navegador.

---

## Abrindo o Ambiente (Codespaces)

1. No topo desta página do repositório no GitHub, clique no botão verde **`< > Code`**.
2. Clique na aba **Codespaces**.
3. Clique no botão verde **Create codespace on main**.
4. Aguarde alguns instantes até que o VS Code abra no seu navegador.

---

## Configurar o Ambiente: incluir extensão Postcode

Adicionar a extensão `REST Client` (para teste de API) do `VS Code` diretamente no container do `Codespace`, usando um arquivo de configuração `.devcontainer/devcontainer.json`, como apresentado abaixo:

```json
{
  "name": "Aulas de Node.js, Banco de Dados (MySQL) e React Native",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "customizations": {
    "vscode": {
      "extensions": [
        "cweijan.vscode-mysql-client2",
        "humao.rest-client"
      ]
    }
  },
  "onCreateCommand": "sudo apt update && sudo apt install -y nodejs npm && sudo apt-get install -y mysql-server git-lfs && git lfs install",
  "postStartCommand": "sudo mkdir -p /var/run/mysqld && sudo chown mysql:mysql /var/run/mysqld && sudo /usr/sbin/mysqld --user=mysql &"
}
```

---

## Rebuild

No `VS Code` do `Codespaces`, digite `CTRL + SHIFT + P`. Na barra de pesquisa, digite `rebuild`. Selecione a opção `Codespaces: Rebuild Container`. Clique no botão `Rebuild`. Aguarde o término do processamento.

---

## Versão

No terminal, execute os comandos abaixo, para visualizar a versão instalada do `Node.js`, do `Node Package Manager (NPM)` e do `MySQL`:

```bash
node -v 
```

```bash
npm -v
```

```bash
mysql --version
```

**OBS**: no caso do `MySQL`, pode ser que seja necessário executar `mysql -V` ou executar o comando `SELECT VERSION()`; após acessar o prompt do banco de dados.

---

## Inicializando o Servidor MySQL no Terminal

No terminal do VS Code, execute os seguintes comandos:

1. **Crie e dê permissão para as pastas do sistema:**

```bash
sudo mkdir -p /var/run/mysqld && sudo chown mysql:mysql /var/run/mysqld
```

2. **Inicie o servidor MySQL em segundo plano:**

```bash
sudo /usr/sbin/mysqld --user=mysql &
```

*(Após dar Enter, algumas linhas de log vão aparecer. **Aperte a tecla ENTER mais uma vez** para liberar a linha de comando).*

3. **Defina a senha do usuário Root para a extensão:**

Conecte no terminal administrativo:

```bash
sudo mysql --protocol=socket -u root
```

Dentro do prompt `mysql>`, cole o comando abaixo e tecle `<Enter>`:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'root';
FLUSH PRIVILEGES;
EXIT;
```

4. **Importe o script de dados inicial:**

```bash
sudo mysql -u root -proot < init.sql
```

*(Lembre-se de deixar o -proot tudo junto. Se colocar espaço entre o -p e o root, o MySQL vai achar que root é o nome de um banco de dados e vai dar erro).*

5. **Entrar no console com senha:**

Para entrar no console interativo agora que tem senha, use:

```bash
sudo mysql -u root -p
```

O terminal vai pedir a senha de forma protegida. Digite root, tecle `<Enter>`. Com isso, o script init.sql será executado.

---

## Verificando os Dados da Tabela de Clientes

No prompt `mysql>` informe:

```sql
USE livraria_db;
```

```sql
SELECT * FROM cliente;
```

![Tabela de Clientes.](./figuras/tabela-cliente.png)

---

## Verificando os Dados da Tabela de Livros

No prompt `mysql>` informe:

```sql
SELECT * FROM livro;
```

![Tabela de Livros.](./figuras/tabela-livro.png)

---

## Verificando os Dados da Tabela de Pedidos

No prompt `mysql>` informe:

```sql
SELECT * FROM pedido;
```

![Tabela de Pedidos.](./figuras/tabela-pedido.png)

---

## Configurando a Extensão "Database Client"

1. Na barra lateral esquerda do VS Code, clique no ícone de **Banco de Dados** (tomada/cilindros).
2. Clique no botão **`+`** (Create Connection).
3. Escolha o tipo de banco: **MySQL**.
4. Preencha os campos exatamente assim:
   - **Host:** `localhost`
   - **Username:** `root`
   - **Password:** `root`
   - **Database:** `livraria_db` *(ou deixe em branco)*
5. Clique no botão **Connect**.

O banco `livraria_db` com as tabelas de cliente, livro e pedido aparecerá na barra lateral esquerda.

![Tela do Database Client.](./figuras/database-client.png)

---

## Estrutura do Projeto

Na raiz do projeto, crie a estrutura de arquivos e diretórios abaixo:

```bash
├── server.js               (Arquivo principal que agrupa tudo. Ponto de entrada, inicia o servidor)
├── db.js                   (Arquivo de conexão com o banco de dados MySQL)
└── rotas/                  (Pasta com as regras de negócio)
    ├── listarLivros.js     (GET: apenas o comando SELECT)
    ├── buscarLivroPorId.js (GET por ID: apenas o comando SELECT)
    ├── cadastrarLivro.js   (POST: apenas o comando INSERT)
    ├── atualizarLivro.js   (PUT: apenas o comando UPDATE)
    └── deletarLivro.js     (DELETE: apenas o comando DELETE)
```

---

## Arquivo Principal do Servidor (server.js)

O arquivo do servidor importa as funções criadas e gerencia os endpoints.

```javascript
import express from 'express';
import cors from 'cors';

// Importando os módulos de rotas (Atenção ao .js no final do caminho!)
import listarLivros from './rotas/listarLivros.js';
import cadastrarLivro from './rotas/cadastrarLivro.js';
import atualizarLivro from './rotas/atualizarLivro.js';
import removerLivro from './rotas/removerLivro.js';

const app = express();
app.use(cors());
app.use(express.json());

// Associando cada rota ao seu respectivo endpoint e método HTTP
app.get('/livros', listarLivros);
app.post('/livros', cadastrarLivro);
app.put('/livros/:id', atualizarLivro);
app.delete('/livros/:id', removerLivro);

app.listen(3000, () => {
  console.log('API (CRUD) ativa na porta 3000.');
});
```

---

## Conexão com o Banco de Dados (bd.js)

Este arquivo centraliza a conexão com o banco de dados. Assim, não precisamos repetir a senha e o host em todas as rotas.

```javascript
import mysql from 'mysql2';

const bd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'livraria_db'
});

bd.connect(err => {
    if (err) console.error('Erro no MySQL:', err);
    else console.log('Conectado ao MySQL com sucesso!');
});

export default bd;
```

---

## Rota GET (rotas/listarLivros.js)

Permite a leitura dos livros cadastrados no banco de dados.

```javascript
import bd from '../bd.js';

export default function listarLivros(req, res) {
  bd.query('SELECT * FROM livro', (erro, resultado) => {
    if (erro) 
      return res.status(500).json({ msg_erro: erro.message });
    
    res.json(resultado);
  });
}
```

---

## Rota GET por ID (rotas/buscarLivroPorId.js)

Permite a busca de um livro cadastrados no banco de dados a partir de seu ID.

```javascript
import bd from '../bd.js';

export default function buscarLivroPorId(req, res) {
  const { id } = req.params;

  const query = 'SELECT id, titulo, autor, preco, estoque FROM livro WHERE id = ?';

  db.query(query, [id], (erro, resultado) => {
    if (erro) 
      return res.status(500).json({ msg_erro: erro.message });

    if (resultado.length === 0) 
      return res.status(404).json({ msg_erro: `Nenhum livro encontrado com ID ${id}.` });
  
    return res.json(resultado[0]);
  });
}
```
---

## Rota POST (rotas/cadastrarLivro.js)

Permite o cadastro de livros no banco de dados.

```javascript
import bd from '../bd.js';

export default function cadastrarLivro(req, res) {
  const { titulo, autor, preco, estoque } = req.body;

  if (!titulo || !autor || !preco || estoque === undefined) 
    return res.status(400).json({ msg_erro: 'Todos os campos são obrigatórios!' });
  
  const query = 'INSERT INTO livro (titulo, autor, preco, estoque) VALUES (?, ?, ?, ?)';

  db.query(query, [titulo, autor, preco, estoque], (erro, resultado) => {
    if (erro) 
      return res.status(500).json({ msg_erro: erro.message });

    res.status(201).json({ id: resultado.insertId, titulo, autor, preco, estoque });
  });
}
```

---

## Rota PUT (rotas/atualizarLivro.js)

Permite a atualização de um livro cadastrado no banco de dados.

```javascript
import bd from '../bd.js';

export default function atualizarLivro(req, res) {
  const { id } = req.params;
  
  const { titulo, autor, preco, estoque } = req.body;

  if (!titulo || !autor || !preco || estoque === undefined) 
    return res.status(400).json({ msg_erro: 'Todos os campos são obrigatórios para atualização!' });
    
  const query = 'UPDATE livro SET titulo = ?, autor = ?, preco = ?, estoque = ? WHERE id = ?';

  db.query(query, [titulo, autor, preco, estoque, id], (erro, resultado) => {
    if (erro) 
      return res.status(500).json({ msg_erro: erro.message });

    if (resultado.affectedRows === 0) 
      return res.status(404).json({ mensagem: 'Livro não encontrado para atualização!' });
    
    res.json({ mensagem: 'Livro atualizado!', id, titulo, autor, preco, estoque });
  });
} 
```

---

## Rota DELETE (rotas/removerLivro.js)

Permite a remoção de um livro cadastrado no banco de dados.

```javascript
import bd from '../bd.js';

export default function removerLivro(req, res) {
  const { id } = req.params;

  const query = 'DELETE FROM livro WHERE id = ?';

  db.query(query, [id], (erro, resultado) => {
    if (erro) 
      return res.status(500).json({ msg_erro: erro.message });

    if (result.affectedRows === 0) 
      return res.status(404).json({ mensagem: 'Livro não encontrado!' });

    res.json({ mensagem: 'Livro e seus pedidos removidos com sucesso!' });
  });
}
``` 

---

## Arquivo de Testes para o REST Client (api.http)

O REST Client lê arquivos de texto com a extensão .http.

Na raiz do projeto no Codespaces, crie um arquivo chamado `api.http`.

Cole o conteúdo de código abaixo dentro dele.

```bash
http

### 1. LISTAR TODOS OS LIVROS (GET)
GET http://localhost:3000/livros

###

### 2. BUSCAR LIVRO POR ID (GET COM ID)
GET http://localhost:3000/livros/1

###

### 3. CADASTRAR NOVO LIVRO (POST)
POST http://localhost:3000/livros
Content-Type: application/json

{
  "titulo": "Dominando Node.js Moderno",
  "autor": "Professor Dias",
  "preco": 59.90,
  "estoque": 10
}

###

### 4. ATUALIZAR LIVRO POR ID (PUT)
PUT http://localhost:3000/livros/1
Content-Type: application/json

{
  "titulo": "Introdução ao SQL (Edição Revisada)",
  "autor": "Luke Code",
  "preco": 54.90,
  "estoque": 12
}

###

### 5. DELETAR LIVRO POR ID (DELETE)
DELETE http://localhost:3000/livros/3
```

---

## Usando o REST Client

1. Abrir o arquivo `api.http`.

2. A extensão `REST Client` vai gerar automaticamente um texto clicável azul escrito `Send Request` logo acima de cada comando (GET, POST, PUT, DELETE).

3. Clique em "Send Request".

4. Uma nova aba se abrirá à direita, mostrando a resposta.

*(Os testes tornam-se documentação oficial do repositório)*.
---

## Exercício

A partir do exemplo desta prática, em novo repositório, crie um banco de dados para:

1. Uma loja que vende equipamento de informática. O banco de dados deve ter as tabelas: cliente, produto e pedido.

2. Um site de viagens. O banco de dados deve ter as tabelas: cliente, destino turístico e pacote de viagem.

3. Gerenciar o estoque de produtos de uma empresa em cada uma de suas filiais.