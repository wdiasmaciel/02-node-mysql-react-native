import bd from '../bd.js';

export default function removerLivro(req, res) {
  const { id } = req.params;

  const query = 'DELETE FROM livro WHERE id = ?';

  bd.query(query, [id], (erro, resultado) => {
    if (erro) 
      return res.status(500).json({ msg_erro: erro.message });

    if (resultado.affectedRows === 0) 
      return res.status(404).json({ mensagem: 'Livro não encontrado!' });

    res.json({ mensagem: 'Livro e seus pedidos removidos com sucesso!' });
  });
}