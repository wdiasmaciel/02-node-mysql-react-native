# Banco de Dados: Node + MySQL + React Native

Nós vamos utilizar o **GitHub Codespaces** para realizar as nossas práticas. Isso significa que você não precisa instalar programas no seu computador pessoal. Tudo vai rodar diretamente no seu navegador.

---

## Abrindo o Ambiente (Codespaces)

1. No topo desta página do repositório no GitHub, clique no botão verde **`< > Code`**.
2. Clique na aba **Codespaces**.
3. Clique no botão verde **Create codespace on main**.
4. Aguarde alguns instantes até que o VS Code abra no seu navegador.

---

## Configurar o Ambiente: instalar o Node, o MySQL e o React Native

Adicionar a extensão `Thunder Client` (plugin para teste de API) do `VS Code` diretamente no container do `Codespace`, usando um arquivo de configuração `.devcontainer/devcontainer.json`, como apresentado abaixo:

```json
{
  "name": "Aulas de Node.js, Banco de Dados (MySQL) e React Native",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "customizations": {
    "vscode": {
      "extensions": [
        "cweijan.vscode-mysql-client2",
        "rangav.vscode-thunder-client"
      ]
    }
  },
  "onCreateCommand": "sudo apt update && sudo apt install -y nodejs npm && sudo apt-get install -y mysql-server git-lfs && git lfs install",
  "postStartCommand": "sudo mkdir -p /var/run/mysqld && sudo chown mysql:mysql /var/run/mysqld && sudo /usr/sbin/mysqld --user=mysql &"
}
```

---

## Rebuild

No `VS Code` do `Codespaces`, digite `CTRL + SHIFT + P`. Na barra de pesquisa digite `rebuild`. Selecione a opção `Codespaces: Rebuild Container`. Clique no botão `Rebuild`. Aguarde o término do processamento.

---

## Versão

No terminal, execute os comandos abaixo, para visualizar a versão instalada do `Node.js`, do `Node Package Manager (NPM)` e do `MySQL`:  :

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

## Crie um Novo Projeto do Node.js

No terminal, execute o comando abaixo:

```bash
npm init
```

Informe o nome do projeto (package name), ou apenas pressionar a tecla `<ENTER>`: `meu-app`

Informe a versão, ou apenas pressionar a tecla `<ENTER>`: `<ENTER>`

Informe uma descrição para o projeto:  `meu aplicativo`

Informe o arquivo principal (inicial) da aplicação (entry point), ou apenas pressionar a tecla `<ENTER>`: `server.js`

Informe um comando de teste, ou apenas pressionar a tecla `<ENTER>`: `<ENTER>`

Informe o repositório do projeto no `GitHub`, ou apenas pressionar a tecla `<ENTER>`: `<ENTER>`

Informe as palavras-chave do projeto, ou apenas pressionar a tecla `<ENTER>`: `Node.js MySQL React-Native`

Informe o nome do autor do projeto, ou apenas pressionar a tecla `<ENTER>`: `<informe seu nome>`

Informe a licença do projeto, ou apenas pressionar a tecla `<ENTER>`: `<ENTER>`

Informe o tipo do projeto: `module`


**OBS**: caso não seja requisitado o tipo do projeto, você terá que informar `"type": "module",`no arquivo `package.json` gerado:

```json
{
  "name": "meu-app",
  "version": "1.0.0",
  "description": "meu aplicativo",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/wdiasmaciel/01-node-mysql-react-native-bd.git"
  },
  "keywords": [
    "Node.js",
    "MySQL",
    "React-Native"
  ],
  "author": "Wesley",
  "license": "ISC",
  "type": "module",
  "bugs": {
    "url": "https://github.com/wdiasmaciel/01-node-mysql-react-native-bd/issues"
  },
  "homepage": "https://github.com/wdiasmaciel/01-node-mysql-react-native-bd#readme"
}
```

---

## Pacotes: express, mysql2 e cors

No terminal, instale os pacotes abaixo:

```bash
npm install express mysql2 cors
```

**OBS**: verifique a inclusão dessas dependências no arquivo `package.json`:

```json
{
  "name": "meu-app",
  "version": "1.0.0",
  "description": "meu aplicativo",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/wdiasmaciel/01-node-mysql-react-native-bd.git"
  },
  "keywords": [
    "Node.js",
    "MySQL",
    "React-Native"
  ],
  "author": "Wesley",
  "license": "ISC",
  "type": "module",
  "bugs": {
    "url": "https://github.com/wdiasmaciel/01-node-mysql-react-native-bd/issues"
  },
  "homepage": "https://github.com/wdiasmaciel/01-node-mysql-react-native-bd#readme",
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "mysql2": "^3.23.3"
  }
}
```

---

## Script Inicial do Banco de Dados

Crie um arquivo chamado `init.sql` na raiz do seu repositório e cole o código abaixo:

```sql
-- 1. CRIAÇÃO DO BANCO DE DADOS
-- Remove o banco se ele já existir (útil se você rodar o script mais de uma vez)
DROP DATABASE IF EXISTS livraria_db;
CREATE DATABASE livraria_db;
USE livraria_db;

-- 2. CRIAÇÃO DAS TABELAS
-- Tabela de Clientes
CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_cadastro DATE NOT NULL
);

-- Tabela de Livros (Produtos)
CREATE TABLE livro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL
);

-- Tabela de Pedidos 
CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_livro INT,
    data_pedido DATE NOT NULL,
    quantidade INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id) ON DELETE CASCADE,
    FOREIGN KEY (id_livro) REFERENCES livro(id) ON DELETE CASCADE
);

-- OBS:
-- ON DELETE CASCADE (Cascateamento de Exclusão):
-- Esta regra de integridade garante que, se um registro na tabela pai (livro ou cliente)
-- for apagado, todos os registros filhos vinculados a ele na tabela dependente (pedidos)
-- serão excluídos automaticamente pelo MySQL.
-- 
-- Sem isso, se você tentasse deletar um livro pelo aplicativo React Native, por exemplo,
-- o MySQL retornaria um erro de segurança (Foreign Key Constraint), impedindo a exclusão, 
-- porque o livro "deixaria órfão" um histórico de pedidos cadastrado.
--
-- O ON DELETE CASCADE funciona como uma linha de dominós. Se você derrubar o dominó 
-- principal (o Livro), todas as peças que dependem dele (os pedidos daquele livro) caem 
-- juntas automaticamente para manter o banco limpo e sem dados perdidos.

-- 3. INSERÇÃO DE DADOS DE TESTE (POPULAR O BANCO)
-- Inserindo Clientes
INSERT INTO cliente (nome, email, data_cadastro) VALUES
('Ana Silva', 'ana.silva@email.com', '2026-01-15'),
('Bruno Costa', 'bruno.costa@email.com', '2026-02-10'),
('Carlos Souza', 'carlos.souza@email.com', '2026-03-01');

-- Inserindo Livros (Corrigido de 'livros' para 'livro')
INSERT INTO livro (titulo, autor, preco, estoque) VALUES
('Introdução ao SQL', 'Luke Code', 49.90, 15),
('Bancos de Dados Relacionais', 'Maria Ramalho', 89.90, 8),
('Lógica de Programação', 'Alan Turing', 35.00, 20);

-- Inserindo Pedidos
INSERT INTO pedido (id_cliente, id_livro, data_pedido, quantidade) VALUES
(1, 1, '2026-03-05', 1), -- Ana comprou Introdução ao SQL
(2, 3, '2026-03-06', 2), -- Bruno comprou 2 Lógicas de Programação
(1, 2, '2026-03-07', 1); -- Ana comprou Bancos de Dados Relacionais
```

---

## Inicializando o Servidor MySQL no Terminal

No terminal do VS Code, execute os seguintes comandos:

1. **Limpe processos travados antigos (se houver):**

```bash
sudo killall -9 mysqld mysqld_safe
```

2. **Crie e dê permissão para as pastas do sistema:**

```bash
sudo mkdir -p /var/run/mysqld && sudo chown mysql:mysql /var/run/mysqld
```

3. **Inicie o servidor MySQL em segundo plano:**

```bash
sudo /usr/sbin/mysqld --user=mysql &
```

*(Após dar Enter, algumas linhas de log vão aparecer. **Aperte a tecla ENTER mais uma vez** para liberar a linha de comando).*

4. **Defina a senha do usuário Root para a extensão:**

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

5. **Importe o script de dados inicial:**

```bash
sudo mysql -u root -proot < init.sql
```

*(Lembre-se de deixar o -proot tudo junto. Se colocar espaço entre o -p e o root, o MySQL vai achar que root é o nome de um banco de dados e vai dar erro).*

6. **Entrar no console com senha:**

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

## Exercício

A partir do exemplo desta prática, em novo repositório, crie um banco de dados para:

1. Uma loja que vende equipamento de informática. O banco de dados deve ter as tabelas: cliente, produto e pedido.

2. Um site de viagens. O banco de dados deve ter as tabelas: cliente, destino turístico e pacote de viagem.

3. Gerenciar o estoque de produtos de uma empresa em cada uma de suas filiais.