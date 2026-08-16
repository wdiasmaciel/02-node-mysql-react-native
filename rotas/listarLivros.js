import bd from '../bd.js';

export default function listarLivros(req, res) {
  bd.query('SELECT * FROM livro', (erro, resultado) => {
    if (erro) 
      return res.status(500).json({ msg_erro: erro.message });
    
    res.json(resultado);
  });
}
