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
				'HORA_RECARGA NVARCHAR2(5),' +
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
                'HORA_DE_USO NVARCHAR2(5),' +
                'DATA_DE_USO DATE,'+
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

        const dataPrimeiroUso = 'select Min(DATA_DE_USO) from USO_DO_BILHETE where USO_DO_BILHETE.FK_ID_USUARIO_BILHETE =:0 ';

        console.log(dataPrimeiroUso);
        return await conexao.execute (dataPrimeiroUso, [(codigo)])

    }
}
function encontrarTipoDoBIlhete(bd)
{
	this.bd=bd;

	this.findBilheteType = async function(codigo){

		const bilheteType = 'select tipo_bilhete.TIPO_BILHETE FROM BILHETE JOIN TIPO_BILHETE on BILHETE.ID_USUARIO_BILHETE = tipo_bilhete.FK_ID_USUARIO_BILHETE where bilhete.FK_ID_USUARIO_BILHETE=:0';
		switch (bilheteType)
		{
			case 'Bilhete Único':
				bilheteType = 40
				break;
			case 'Bilhete duplo':
				bilheteType = 80
				break;
			case '7 dias':
				bilheteType = 7
				break;
			case '30 dias':
				bilheteType = 30
				break;
				default:

		}
		console.log(bilheteType);
		return await conexao.execute(bilheteType, [(codigo)])
	}
	
}

async function inclusaoRecarga(req, res) {
	const Recarga = new getSelectBil(req.body.tipo, req.body.cdb)
	console.log(Recarga)
	try {
		await global.recargas.insert_re(Recarga);
		console.log('Insert working');
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
		console.log('Insert working');
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
		console.log('Insert working');
	}
	catch (err) {
		console.log('Error in pegarTipoBilhete');
		console.log(err)
	}
}

function getSelectBil(tipo, cdb) {
	this.tipo = tipo;
	this.cdb = cdb;
	this.datacri = new Date().toLocaleDateString();
	this.horacri = new Date().toLocaleTimeString();
	console.log(tipo)
}

function Bilhete(id, datac, horac) {
	this.cdb = id;
	this.datacri = new Date().toLocaleDateString();
	this.horacri = new Date().toLocaleTimeString();
}

function getUsoBilhete(idUso, cdb) {
    this.idUso
    this.cdb = cdb;
    this.datacri = new Date().toLocaleDateString();
    this.horacri = new Date().toLocaleTimeString();
    console.log(idUso)
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
        console.log('Insert working');
    }
    catch (err) {
        console.log('Error in inclusaoUso');
        console.log(err)
    }
}

async function abrirServer() {
	const bd = new conectarNoBancoDeDados();
	await bd.criadorDeTabelas();
	global.Bilhetes = new inserirBilheteBanco(bd);
	global.recargas = new inserirRecargaBilhete(bd);
	global.usos = new inserirUsosDoBilhete(bd);
	global.data = new getDataPrimeiroUso(bd);
	global.tipo = new encontrarTipoDoBIlhete(bd);

	app.use(express.json());
	app.use(cors());
	app.use(middleWareGlobal);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		app.use(cors());
		next();
	});

	// cria o endpoint POST /Bilhete e /Recarga
	app.post('/Bilhete', inclusaoBilhete);
	app.post('/Recarga', inclusaoRecarga);
	app.post('/usoBilhete', inclusaoUso);
	app.post('/dataVencimento',pegarDatavencimento);
	app.post('/tipoBilhete', findBilheteType)
	console.log('Server port ' + PORT);
	app.listen(PORT);
}

abrirServer();
