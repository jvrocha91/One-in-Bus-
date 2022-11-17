function generateRandomNumber(){
    const min=100000000;
    const max=999999999;
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