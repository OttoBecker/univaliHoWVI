const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost', //Host
    user: 'otto_becker', //Usuário
    password: 'teste123', //Senha
    database: 'forum_tematico', //Banco
});

con.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao MySQL');
        throw erro;
    }
    console.log('Conectado ao MySQL com sucesso!')
    let sql = ` CREATE TABLE IF NOT EXISTS CLIENTES 
                (id_cliente int primary key auto_increment not null,
                nome varchar(255) not null,
                cpf varchar(14) not null,
                dataCadastro datetime not null);`;
    con.execute(sql, (erro, retorno) =>{
        if(erro){
            console.error('Erro ao criar as tabelas necessárias:', erro)
            throw erro
        } else if (retorno.warningStatus == 0){
            console.log('Criado tabela de CLIENTES')
        }
        
    });

    sql = `     CREATE TABLE IF NOT EXISTS COMPRAS
                (id_compra int primary key auto_increment not null,
                descricao varchar(255) not null,
                valor float not null,
                metodoPagamento VARCHAR(45),
                dataCompra DATETIME,
                id_cliente int not null,
                CONSTRAINT FK_COMPRAS FOREIGN KEY (id_cliente) REFERENCES CLIENTES(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE)`;

    con.execute(sql, (erro, retorno) =>{
        if(erro){
            console.error('Erro ao criar as tabelas necessárias:', erro)
            throw erro
        } else if (retorno.warningStatus == 0){
            console.log('Criado tabela de COMPRAS')
        }
        
    });


})

module.exports = con