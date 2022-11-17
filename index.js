const bodyParser = require('body-parser');
const { Console } = require('console');

function banco_de_dados ()
{
	process.env.ORA_SDTZ = 'UTC-3'; 
	
	this.getConexao = async function ()
	{
		if (global.conexao)
			return global.conexao;

        const oracledb = require('oracledb');
        const dbConfig = require('./oracleconfig.js');
        
        try
        {
		    global.conexao = await oracledb.getConnection(dbConfig);
		}
		catch (erro)
		{
			console.log ('Cannot connect');
			process.exit(1);
		}

		return global.conexao;
	}

	this.estrutureSe = async function ()
	{
		try
		{
			const conexao = await this.getConexao();
			const sql     = 'CREATE TABLE BILHETE (ID_USUARIO_BILHETE NUMBER(9)CONSTRAINT PK_ID_USUARIO_BILHETE PRIMARY KEY,'+
			'HORA_CRIACAO NVARCHAR2(8),'+
			'DATA_CRIACAO DATE)';
			await conexao.execute(sql);
			console.log('Table created')
		}
		catch (erro)
		{} 
	}
}

function BILHETE (bd)
{
	this.bd = bd;
	
	this.inclua = async function (Bilhete)
	{

		const sql1 = "INSERT INTO BILHETE VALUES (:0,:1,:2)";
		const dados = [( parseInt(Bilhete.cdb)),( Bilhete.horacri),( Bilhete.datacri)];
	
	
		console.log(sql1, dados);
		await conexao.execute(sql1, dados);//
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	
	}	
}	


function Bilhete (id,datac,horac)
{
	    this.cdb = id;
	    this.datacri = new Date().toLocaleDateString();
	    this.horacri = new Date().toLocaleTimeString();
}

function middleWareGlobal (req, res, next)
{
    console.time('Req'); 
    console.log('method: '+req.method+'; URL: '+req.url); 

    next(); 

    console.log('END'); 

    console.timeEnd('Req'); 
}

async function inclusao (req, res)
{
    const Bilhetecriado = new Bilhete (req.body.id,req.body.datac,req.body.horac);
    try
    {
        await  global.Bilhetes.inclua(Bilhetecriado);
		console.log('Insert suc');
	}
	catch (err)
	{
		console.log('Error in including');
		console.log(err)
    }
}

async function server ()
{
    const bd = new banco_de_dados ();
	await bd.estrutureSe();
    global.Bilhetes = new BILHETE (bd);

    const express = require('express');
    const app     = express();
	const cors    = require('cors')
    const bodyParser = require("body-parser");
	const fs = require("fs");
	const { response } = require("express");
	const PORT = 4000;

    app.use(express.json());   
	app.use(cors()); 
    app.use(middleWareGlobal); 
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		app.use(cors());
		next();
	  });

    app.post  ('/Bilhete'        , inclusao); 

    console.log ('Server port 4000')
    app.listen(4000);
}

server();
