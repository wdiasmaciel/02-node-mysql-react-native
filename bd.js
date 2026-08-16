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
