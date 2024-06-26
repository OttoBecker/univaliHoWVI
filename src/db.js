const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost', //Host
    user: 'otto_becker', //Usuário
    password: 'teste123', //Senha
    database: 'forum_tematico' //Banco
});

con.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao MySQL:', erro);
        throw erro
    }
    console.log('Conectado ao MySQL com sucesso!')
})

module.exports = con