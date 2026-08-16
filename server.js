import express from 'express';
import cors from 'cors';

// Importando os módulos de rotas (Atenção ao .js no final do caminho!)
import listarLivros from './rotas/listarLivros.js';
import buscarLivroPorId from './rotas/buscarLivroPorId.js';
import cadastrarLivro from './rotas/cadastrarLivro.js';
import atualizarLivro from './rotas/atualizarLivro.js';
import removerLivro from './rotas/removerLivro.js';

const app = express();
app.use(cors());
app.use(express.json());

// Associando cada rota ao seu respectivo endpoint e método HTTP
app.get('/livros', listarLivros);
app.get('/livros/:id', buscarLivroPorId);
app.post('/livros', cadastrarLivro);
app.put('/livros/:id', atualizarLivro);
app.delete('/livros/:id', removerLivro);

app.listen(3000, () => {
  console.log('API (CRUD) ativa na porta 3000.');
});
