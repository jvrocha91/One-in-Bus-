const bodyParser = require('body-parser');
const { Console } = require('console');
const express = require('express');
const app = express();
const cors = require('cors')
const fs = require("fs");
const { response } = require("express");
const PORT = 4000;

function conectarNoBancoDeDados() {
	process.env.ORA_SDTZ = 'UTC-3';

	this.getConexao = async function () {
		if (global.conexao)
			return global.conexao;

		const oracledb = require('oracledb');
		const dbConfig = require('./oracleconfig.js');

		try {
			global.conexao = await oracledb.getConnection(dbConfig);
		}
		catch (erro) {
			console.log('Cannot connect');
			process.exit(1);
		}

		return global.conexao;
	}

	this.criadorDeTabelas = async function () {
		try {
			console.log("criando bilhete")
			const conexao = await this.getConexao();
			const sql = 'CREATE TABLE BILHETE (ID_USUARIO_BILHETE NUMBER(9)CONSTRAINT PK_ID_USUARIO_BILHETE PRIMARY KEY,' +
				'HORA_CRIACAO NVARCHAR2(8),' +
				'DATA_CRIACAO DATE)';
			await conexao.execute(sql);
			console.log('Table bilhete created')
		}
		catch (erro) {
			console.log(erro)
		}
		try {
			console.log("criando tipo_bilhete")
			const conexao = await this.getConexao();
			const sql = 'CREATE TABLE TIPO_BILHETE (TIPO_BILHETE NVARCHAR2(30)CONSTRAINT PK_TIPO_BILHETE PRIMARY KEY,' +
				'HORA_RECARGA NVARCHAR2(8),' +
				'DATA_RECARGA DATE,' +
				'FK_ID_USUARIO_BILHETE NUMBER(9),' +
				'FOREIGN KEY (FK_ID_USUARIO_BILHETE) references BILHETE(ID_USUARIO_BILHETE),' +
				'UNIQUE (FK_ID_USUARIO_BILHETE))';

			await conexao.execute(sql);
			console.log('Table Tipo bilhete created')
		}
		catch (erro) {
			console.log(erro)
		}
		try {
			console.log("criando uso do bilhete")
			const conexao = await this.getConexao();
			const sql = 'CREATE TABLE USO_DO_BILHETE (USO_DO_BILHETE NUMBER(3)CONSTRAINT PK_USO_DO_BILHETE PRIMARY KEY,' +
				'HORA_DE_USO NVARCHAR2(8),' +
				'DATA_DE_USO DATE,' +
				'FK_ID_USUARIO_BILHETE NUMBER(9),' +
				'FOREIGN KEY (FK_ID_USUARIO_BILHETE) references BILHETE(ID_USUARIO_BILHETE))';

			await conexao.execute(sql);
			console.log('Table uso do bilhete created')
		}
		catch (erro) {
			console.log(erro)
		}
	}
}

function inserirBilheteBanco(bd) {
	this.bd = bd;

	this.inclua = async function (Bilhete) {

		const sql1 = "INSERT INTO BILHETE VALUES (:0,:1,:2)";
		const dados = [(parseInt(Bilhete.cdb)), (Bilhete.horacri), (Bilhete.datacri)];


		console.log(sql1, dados);
		await conexao.execute(sql1, dados);

		const sql2 = 'COMMIT';
		await conexao.execute(sql2);
	}
}

function inserirRecargaBilhete(bd) {
	this.bd = bd;

	this.insert_re = async function (get_selected_bil) {

		const sql1 = "INSERT INTO TIPO_BILHETE VALUES (:0,:1,:2,:3)";
		const dados = [(get_selected_bil.tipo), (get_selected_bil.horacri), (get_selected_bil.datacri), (parseInt(get_selected_bil.cdb))];

		console.log(sql1, dados);
		await conexao.execute(sql1, dados);

		const sql2 = 'COMMIT';
		await conexao.execute(sql2);
	}
}

function inserirUsosDoBilhete(bd) {
	this.bd = bd;

	this.insert_use = async function (getUsoBilhete) {

		const sql1 = "INSERT INTO USO_DO_BILHETE VALUES (:0,:1,:2,:3)";
		const dados = [(getUsoBilhete.idUso), (getUsoBilhete.horacri), (getUsoBilhete.datacri), (parseInt(getUsoBilhete.cdb))];

		console.log(sql1, dados);
		await conexao.execute(sql1, dados);

		const sql2 = 'COMMIT';
		await conexao.execute(sql2);
	}
}
function getDataPrimeiroUso(bd) {
	this.bd = bd;

	this.Find_Fist_Date = async function (codigo) {

		const dataPrimeiroUsoSql = 'select Min(DATA_DE_USO) from USO_DO_BILHETE where USO_DO_BILHETE.FK_ID_USUARIO_BILHETE =:0 ';
		const tempoPrimeiroUsoSql = 'select Min(HORA_DE_USO) from USO_DO_BILHETE where USO_DO_BILHETE.FK_ID_USUARIO_BILHETE =:0 ';
		const result = await conexao.execute(dataPrimeiroUsoSql, [(codigo)])
		const resultTempo = await conexao.execute(tempoPrimeiroUsoSql, [(codigo)])
		const result1 = result.rows[0][0]
		const result2 = resultTempo.rows[0][0]
		global.dataPrimeiroUso = result1.toLocaleDateString("pt-br")
		global.tempoPrimeiroUso = result2.toLocaleDateString("pt-br")
		console.log(global.dataPrimeiroUso);
		console.log(global.tempoPrimeiroUso)


	}
}
function encontrarTipoDoBIlhete(bd) {
	this.bd = bd;

	this.findBilheteType = async function (codigo) {
		0
		const bilheteTypeSql = 'select tipo_bilhete.TIPO_BILHETE FROM BILHETE JOIN TIPO_BILHETE on BILHETE.ID_USUARIO_BILHETE = tipo_bilhete.FK_ID_USUARIO_BILHETE where TIPO_BILHETE.FK_ID_USUARIO_BILHETE=:0';
		const result = await conexao.execute(bilheteTypeSql, [(codigo)])
		const bilheteType = result.rows[0][0]
		console.log(bilheteType)
		global.bilheteTypes
		switch (bilheteType) {
			case 'Bilhete ??nico':
				global.bilheteTypes = 40
				break;
			case 'Bilhete duplo':
				global.bilheteTypes = 80
				break;
			case '7 dias':
				global.bilheteTypes = 7
				break;
			case '30 dias':
				global.bilheteTypes = 30
				break;

			default:
				global.bilheteTypes = -1
				break;
		}
		console.log(global.bilheteTypes)
	}

}
function selectTheHistorico(bd) {
	this.bd = bd;
	this.findSelectedHistory = async function (codigo) {

		const selecionarHistorico = 'select DATA_DE_USO From USO_DO_BILHETE where FK_ID_USUARIO_BILHETE=:0';
		console.log(selecionarHistorico)
		result = await conexao.execute(selecionarHistorico, [(codigo)])
		console.log(result)
		return result.rows


	}
}
function dropBilhete(bd) {

	this.bd = bd
	this.deletarBilhete = async function (codigo) {

		const sql1 = 'delete from USO_DO_BILHETE where FK_ID_USUARIO_BILHETE =:0';
		const sql2 = 'delete from TIPO_BILHETE where FK_ID_USUARIO_BILHETE =:0';
		const sql3 = 'delete from BILHETE where ID_USUARIO_BILHETE =:0';
		console.log(sql1, sql2, sql3, codigo);
		await conexao.execute(sql1, [(codigo)]);
		await conexao.execute(sql2, [(codigo)]);
		await conexao.execute(sql3, [(codigo)]);
		const sql4 = 'COMMIT';
		await conexao.execute(sql4);
	}
}

async function inclusaoRecarga(req, res) {
	const Recarga = new getSelectBil(req.body.tipo, req.body.cdb)
	console.log(Recarga)
	try {
		await global.recargas.insert_re(Recarga);
		console.log('Insert Recarga working');
		res.status(200)
	}
	catch (err) {
		console.log('Error in inclusaoRecarga');
		console.log(err)
	}
}
async function pegarDataVencimento(req, res) {
	const codigo = req.body.cdb
	console.log(codigo)
	try {
		await global.Data.Find_Fist_Date(codigo);
		console.log('Pegar data vencimento working');
		res.status(200)
	}
	catch (err) {
		console.log('Error in dataVencimento');
		console.log(err)
	}
}
async function pegarTipoBilhete(req, res) {
	const codigo = req.body.cdb
	console.log(codigo)
	try {
		await global.tipo.findBilheteType(codigo);
		console.log('finding working');
		res.status(200)
	}
	catch (err) {
		console.log('Error in pegarTipoBilhete');
		console.log(err)
	}
}
async function selectHistorico(req, res, next) {
	const codigo = req.query.cdb
	console.log(codigo)
	try {
		const returno = await global.historicos.findSelectedHistory(codigo);
		console.log("recebendo historico")
		console.log(returno)
		res.status(200).send(returno)
	}
	catch (err) {
		console.log("error in selecting")
		console.log(err)
	}
}
async function DeleteBil(req, res) {
	const codigo = req.body.cdb
	console.log(codigo)
	try {
		await global.deletando.deletarBilhete(codigo);
		console.log("deleting Funciona")
		res.status(200)
	}
	catch (err) {
		console.log("error in deleting")
		console.log(err)
	}
}

function getSelectBil(tipo, cdb) {
	this.tipo = tipo;
	this.cdb = cdb;
	this.datacri = new Date().toLocaleDateString("pt-br");
	this.horacri = new Date().toLocaleTimeString("pt-br");
	console.log(tipo)
}

function Bilhete(id, datac, horac) {
	this.cdb = id;
	this.datacri = new Date().toLocaleDateString("pt-br");
	this.horacri = new Date().toLocaleTimeString("pt-br");
}

function getUsoBilhete(idUso, cdb) {
	this.idUso = idUso;
	this.cdb = cdb;
	this.datacri = new Date().toLocaleDateString("pt-br");
	this.horacri = new Date().toLocaleTimeString("pt-br");
	console.log(idUso)
	console.log(cdb)
}

function middleWareGlobal(req, res, next) {
	console.time('Req');
	console.log('method: ' + req.method + '; URL: ' + req.url);

	next();

	console.log('END');

	console.timeEnd('Req');
}

async function inclusaoBilhete(req, res) {
	const Bilhetecriado = new Bilhete(req.body.id, req.body.datac, req.body.horac);
	try {
		await global.Bilhetes.inclua(Bilhetecriado);
		console.log('Insert suc');
	}
	catch (err) {
		console.log('Error in including');
		console.log(err)
	}
}
async function inclusaoUso(req, res) {
	const usoBilhete = new getUsoBilhete(req.body.idUso, req.body.cdb)
	console.log(usoBilhete)
	try {
		await global.usos.insert_use(usoBilhete);
		console.log('Insert uso working');
	}
	catch (err) {
		console.log('Error in inclusaoUso');
		console.log(err)
	}
}
function encontrarDiaMesAnoVence(req, res) {
	console.log("encontrarDiaMesAnoVence")
	console.log(global.dataPrimeiroUso)
	console.log(global.tempoPrimeiroUso)
	var result = global.dataPrimeiroUso.split("/").reverse().join("/")
	var dateex = '01-02-1990';
	var result1 = dateex + ' ' + global.tempoPrimeiroUso
	console.log(result)
	console.log(result1)
	dataVencimento = new Date(result);
	tempoVencimento = new Date(result1)
	console.log(dataVencimento)
	console.log(tempoVencimento)
	dataAtual = new Date();
	console.log(dataAtual)
	if (global.bilheteTypes == 40) {
		tempoVencimento.setMinutes(tempoVencimento.getMinutes() + 40)
		console.log(tempoVencimento)

		if (dataAtual > tempoVencimento) {
			console.log("deletando bilhete 40 minutos")

			DeleteBil(req, res)
		}
		else {
			console.log("Bilhete esta dentro do prazo")
		}

	}
	if (global.bilheteTypes == 80) {
		tempoVencimento.setMinutes(tempoVencimento.getMinutes() + 80)
		console.log(tempoVencimento)

		if (dataAtual > tempoVencimento) {
			console.log("deletando bilhete 80 minutos")

			DeleteBil(req, res)
		}
		else {
			console.log("Bilhete esta dentro do prazo")
		}

	}

	if (global.bilheteTypes == 7) {
		dataVencimento.setDate(dataVencimento.getDate() + 7);
		console.log(dataVencimento)

		if (dataAtual > dataVencimento) {
			console.log("deletando bilhete 7 dias")

			DeleteBil(req, res)
		}
		else {
			console.log("Bilhete esta dentro do prazo")
		}

	}
	if (global.bilheteTypes == 30) {
		dataVencimento.setDate(dataVencimento.getDate() + 30);

		if (dataAtual > global.dataPrimeiroUso) {
			console.log("deletando bilhete 30 dias")
			DeleteBil(req, res)
		}
		else {
			console.log("Bilhete esta dentro do prazo")
		}

	}
	res.status(200)
}



async function abrirServer() {
	const bd = new conectarNoBancoDeDados();
	await bd.criadorDeTabelas();
	global.Bilhetes = new inserirBilheteBanco(bd);
	global.recargas = new inserirRecargaBilhete(bd);
	global.usos = new inserirUsosDoBilhete(bd);
	global.Data = new getDataPrimeiroUso(bd);
	global.tipo = new encontrarTipoDoBIlhete(bd);
	global.historicos = new selectTheHistorico(bd);
	global.deletando = new dropBilhete(bd);
	global.dataPrimeiroUso;
	global.tempoPrimeiroUso;
	global.bilheteTypes;


	app.use(express.json());
	app.use(cors());
	app.use(middleWareGlobal);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		app.use(cors());
		next();
	});
	app.options('*', cors()); // this enables preflight

	// cria o endpoint POST /Bilhete e /Recarga
	app.post('/Bilhete', inclusaoBilhete);
	app.post('/Recarga', inclusaoRecarga);
	app.post('/usoBilhete', inclusaoUso);
	app.post('/dataVencimento', pegarDataVencimento);
	app.post('/tipoBilhete', pegarTipoBilhete)
	app.get('/historicoUso', selectHistorico)
	app.post('/apagarBilhete', encontrarDiaMesAnoVence)

	console.log('Server port ' + PORT);
	app.listen(PORT);
}

abrirServer();
