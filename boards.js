var tokenUsu;
atvToken();

    
    function atvToken(){
        tokenUsu = sessionStorage.getItem("token");
        if(tokenUsu == undefined){
            alert("ERRO NA PAGINA");
            window.location.href = "index.html";
        }
    }

    

document.addEventListener("DOMContentLoaded", load, false);


function newCard(nome, cor, id){
    return `<div class="col-10 offset-1  offset-md-0 col-lg-3 col-md-4">
                <div class="card text-white board"  style="background-color: ${cor};"  onclick="direcionarBoard(${id})">
                    <div class="card-img-overlay">
                        <div class="container-fluid">
                            <div class="row">
                                <h5 class="card-title">${nome}</h5>
                            </div>
                            <div class="row">
                                <input class="col-3 col-md-4 btn btn-danger btn-board align-middle" type="button" value="&#10006;" onclick="deletBoard(event, ${id})">
                                <input class="col-3 col-md-4 btn btn-secondary btn-board align-middle" type="button" value="&#x270E;"  data-toggle="modal" data-target="#Modal${id}" onclick="event.stopPropagation(); $('#Modal${id}').modal('show');">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="Modal${id}" tabindex="-1" role="dialog" aria-labelledby="TituloModalCentralizado" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="TituloModalCentralizado">Editar board "${nome}"</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="container-fluid">
                                        <div class="row">
                                            
                                                <input type="text"  required class="form-control col-8" name="" id="modText${id}" placeholder="Novo Nome" value="${nome}">
                                                <input type="color" list="presetColors" class="form-control col-4" name="" id="modColor${id}" style="height: 40px;" value="${cor}">
                                                <datalist id="presetColors">
                                                    <option>##0079BF</option>
                                                    <option>#D29034</option>
                                                    <option>#519839</option>
                                                    <option>#B04632</option>
                                                    <option>#89609E</option>
                                                    <option>#CD5A91</option>
                                                    <option>#4BBF6B</option>
                                                    <option>#00AECC</option>
                                                    <option>#838C91</option>
                                                </datalist>
                                            
                                        </div>
                                        <div class="row" style="margin-top: 10px;">
                                            
                                                
                                                <input id="" class="btn btn-success col-4" type="button" value="Salvar Alteração" onclick="salvarMod(${id})">
                                           
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
            
            `
}



let cardAdd =   `<div class="col-10 offset-1 offset-md-0 col-lg-3 col-md-4 " data-toggle="modal" data-target="#exampleModalCenter">
                    <div class="card bg-light text-primary board-adicionar">
                        <div class="card-img-overlay form-group text">
                            <h5 class="card-title" >Adicionar board</h5> 
                        </div>
                    </div> 
                </div>`;








function load(){
    
    submitAdicionarEvent();
    carregarBoards();

    
}

function submitAdicionarEvent(){

    let form = document.getElementById("formAdicionarBoard");

    form.addEventListener("submit", function(e){

        e.preventDefault();

        let url = "https://tads-trello.herokuapp.com/api/trello/boards/new";
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
           if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            carregarBoards();
           }
           if (this.readyState == 4 && this.status == 400) {
            alert("Board ja cadastrado");
           }
        }

        let newBoard = {
            
            name: document.getElementById("newBoardText").value,
            color: document.getElementById("newBoardColor").value,
            token: tokenUsu
            

        };

        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        console.log(newBoard);
        xhttp.send(JSON.stringify(newBoard));

    })   
}


function carregarBoards(){
    let xhttp = new XMLHttpRequest();
    let url = "https://tads-trello.herokuapp.com/api/trello/boards/" + tokenUsu;
    console.log(url);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        let arrayCards = JSON.parse(this.responseText);
        console.log(arrayCards);
        let domCards = "";
        arrayCards.forEach(objCard => {
            domCards += newCard(objCard.name, objCard.color, objCard.id)
        });

        document.getElementById("quadroBoards").innerHTML = (domCards + cardAdd);


    };  
}
    xhttp.open("GET", url, true);
    xhttp.send();
}

function deletBoard(event, id){
    event.stopPropagation();
    let xhttp = new XMLHttpRequest();
    let url = "https://tads-trello.herokuapp.com/api/trello/boards/delete";
    console.log(url);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        
        carregarBoards();


    };  
}
    let boardDelet = {
        
        board_id: `${id}`,
        token: tokenUsu

    };
    console.log(JSON.stringify(boardDelet));
    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(boardDelet));
}

function mudarCor(id){
    let xhttp = new XMLHttpRequest();
    let url = "https://tads-trello.herokuapp.com/api/trello/boards/newcolor";
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        
        
        location.href = "boards.html"


    };  
}
    let boardNewColor = {
        
        board_id: `${id}`,
        color: document.getElementById(`modColor${id}`).value,
        token: tokenUsu

    };

    

    
    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(boardNewColor));
}

function mudarTitulo(id){
    
    let xhttp = new XMLHttpRequest();
    let url = "https://tads-trello.herokuapp.com/api/trello/boards/rename";
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        
        location.href = "boards.html" 

    };  
}
    let boardNewTit = {
        
        board_id: `${id}`,
        name: document.getElementById(`modText${id}`).value,
        token: tokenUsu

    };

    if(boardNewTit.name.length > 0){

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(boardNewTit));
    }
    else{
        document.getElementById(`modText${id}`).style.borderColor = "red";
        alert("DIgite um nome valido");
    }
}

function salvarMod(id){
    mudarCor(id);
    mudarTitulo(id);
}

function logoff(){

    sessionStorage.removeItem("token");
    location.href = "index.html"
}

function direcionarBoard(id){
    window.location.href = `lists.html?${id}`
}