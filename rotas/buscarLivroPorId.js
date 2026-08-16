import bd from '../bd.js';

export default function buscarLivroPorId(req, res) {
  const { id } = req.params;

  const query = 'SELECT id, titulo, autor, preco, estoque FROM livro WHERE id = ?';

  bd.query(query, [id], (erro, resultado) => {
    if (erro) 
      return res.status(500).json({ msg_erro: erro.message });

    if (resultado.length === 0) 
      return res.status(404).json({ msg_erro: `Nenhum livro encontrado com ID ${id}.` });
  
    return res.json(resultado[0]);
  });
}