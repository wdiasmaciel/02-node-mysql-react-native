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