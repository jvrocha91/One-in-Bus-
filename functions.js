function generateRandomNumber(){
    const min=100000000;
    const max=999999999;
        var num=Math.floor(Math.random()*(max - min + 1) + min);
return num;
}

function generateIdUso(){

    const min=100;

    const max=999;

        var num=Math.floor(Math.random()*(max - min + 1) + min);

return num;

}

function show_Id() {
    let viso = document.getElementById('num1');
    let numero = generateRandomNumber();
    viso.innerHTML = numero
    return numero;
    }

  function cadastraBilhete() {
  
  let id = show_Id();

  var xhr = new XMLHttpRequest();             
    xhr.open("POST", "http://localhost:4000/Bilhete", true);             
    xhr.setRequestHeader('Content-Type', 'application/json');             
    xhr.send(JSON.stringify({                 
        id:id,           
    }));
}

function recarregabil() {
    const codigoDatabase = document.getElementById('codigo_bilhete').value;
    var menu = document.getElementById("Tipo");
	var value = menu.value;
	var tipo = menu.options[menu.selectedIndex].text;
    console.log(codigoDatabase)
    console.log(tipo)
    let objRecarga = { cdb:codigoDatabase, tipo:tipo };
    let url = 'http://localhost:4000/Recarga/'
    let res = axios.post(url, objRecarga).then(response => {
        if (response.data) {
            showmessageSuccess();
            const msg = new Comunicado(response.data.mensagem);
            console.log(msg.get());
        }
    })
        .catch(error => {
            if (error.response) {
                showmessageError();
                const msg = new Comunicado
                (error.reponse.data.mensagem);
                console.log(msg.get());
}
        })
}
function cadastraUsos() {

    const codigoDatabase = document.getElementById('codigo_bilhete1').value;
    let idUso = generateIdUso;
    console.log(codigoDatabase)

    console.log(idUso)

    let objUso = { cdb:codigoDatabase, idUso:idUso };

    let url = 'http://localhost:4000/usoBilhete/'

    let res = axios.post(url, objUso).then(response => {

        if (response.data) {

            showmessageSuccess();

            const msg = new Comunicado(response.data.mensagem);

            console.log(msg.get());

        }

    })

        .catch(error => {

            if (error.response) {

                showmessageError();

                const msg = new Comunicado

                (error.reponse.data.mensagem);

                console.log(msg.get());

}

        })

}
function pegaDataDePrimeiroUso()
{
    const num = document.getElementById('codigo_bilhete1').value;
    let objUso = { cdb:num };

    let url = 'http://localhost:4000/dataVencimento/'

    let res = axios.post(url, objUso).then(response => {

        if (response.data) {

            console.log(reponse.data)
        
        }

    })

        .catch(error => {

            if (error.response) {

                showmessageError();

                const msg = new Comunicado

                (error.reponse.data.mensagem);

                console.log(msg.get());

}

        })


}

function GetHistory()
{
    let url = 'http://localhost:4000/HistoricoUso/'

    let res = axios.get(url).then(response => {

        if (response.data) {

            showHistorico(response.data)

            showmessageSuccess();

            const msg = new Comunicado(response.data.mensagem);

            console.log(msg.get());

        }

    })

        .catch(error => {

            if (error.response) {

                showmessageError();

                const msg = new Comunicado

                (error.reponse.data.mensagem);

                console.log(msg.get());

}

        })
 
}

function showHistorico(data)
{
    var his = data
    
}

