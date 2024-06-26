const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const path = require('path');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false})

const con = require('./db')

app.use(express.static(path.join(__dirname, 'public'))); //Utilizar html

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'clientes.html'))
});

app.get('/pagina-compras', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'compras.html'))
});

app.get('/clientes', (req, res) => {

  let sql = `SELECT id_cliente, 
                    nome, 
                    cpf, 
                    DATE_FORMAT(dataCadastro, '%d/%m/%Y %H:%i:%s') as dataCadastro   
                  FROM CLIENTES
                  ORDER BY id_cliente desc`;

  con.query(sql, (erro, resultados) => {
    if(erro){
      res.status(500);
      res.send(JSON.stringify(erro));
      console.log(erro)
    } else{
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      addCorsHttpHeaders(res);
      console.log(resultados);
      res.send(JSON.stringify(resultados));
    }
  });

});

app.get('/compras', (req, res) => {

  let sql = `SELECT 
                CLIENTES.nome, 
                COMPRAS.id_compra,
                COMPRAS.descricao,
                FORMAT(valor, 2, 'pt-br') as valor,
                COMPRAS.metodoPagamento,
                DATE_FORMAT(COMPRAS.dataCompra, '%d/%m/%Y %H:%i:%s') as dataCompra
            FROM COMPRAS
              LEFT JOIN CLIENTES on clientes.id_cliente = COMPRAS.id_cliente
            ORDER BY COMPRAS.id_compra desc`;

  con.query(sql, (erro, resultados) => {
    if(erro){
      res.status(500);
      res.send(JSON.stringify(erro));
      console.log(erro)
    } else{
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      addCorsHttpHeaders(res);
      console.log(resultados);
      res.send(JSON.stringify(resultados));
    }
  });

});

app.post('/clientes', urlencodedParser, (req, res) => {
  let nome = req.body.nome
  let cpf = req.body.cpf
  let parametros = [nome, cpf]
  let sql = `INSERT INTO CLIENTES
             (nome, cpf, dataCadastro)
             VALUES
             (?, ?, NOW())`
  con.query(sql, parametros, (erro, resultados) => {
    if(erro){
      res.status(500);
      res.send(JSON.stringify(erro));
    } else {
      addCorsHttpHeaders(res);
      let redirecionar = 'http://localhost:' + PORT
      res.redirect(redirecionar)
    }
  });

});

app.post('/compras', urlencodedParser, (req, res) => {
  let cliente = req.body.id_cliente
  let descricao = req.body.descricao
  let valor = req.body.valor
  let metodoPagamento = req.body.metodoPagamento
  let parametros = [cliente, descricao, valor, metodoPagamento]
  let sql = `INSERT INTO COMPRAS
             (id_cliente, descricao, valor, metodoPagamento, dataCompra)
             VALUES
             (?, ?, replace(?, ',', '.'), ?, NOW())`
             
  con.query(sql, parametros, (erro, resultados) => {
    if(erro){
      res.status(500);
      res.send(JSON.stringify(erro));
    } else {
      addCorsHttpHeaders(res);
      let redirecionar = 'http://localhost:' + PORT + '/pagina-compras'
      res.redirect(redirecionar)
    }
  });

});

app.listen(PORT, () => {
    console.log(`App online na porta ${PORT}\n\n------------------------------\nAcesse http://localhost:${PORT}/\n------------------------------\n`)
});

function addCorsHttpHeaders(httpResponse){
    httpResponse.setHeader("Access-Control-Allow-Origin", "*");
    httpResponse.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS,PUT,DELETE,HEAD");
    httpResponse.setHeader("Access-Control-Allow-Headers","X-PINGOTHER,Origin,X-Requested-With,Content-Type,Accept");
    httpResponse.setHeader("Access-Control-Max-Age","1728000");
  }

console.log('Node express está funcionando!')