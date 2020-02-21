document.addEventListener("DOMContentLoaded", load, false);

checkToken();

    
function checkToken(){
    tokenUsu = sessionStorage.getItem("token");
    if(tokenUsu != null){
        window.location.href = "boards.html";
    }
}

function load(){
    submitEvent();


    
}


function submitEvent(){

    let form = document.getElementById("formCadastro");

    form.addEventListener("submit", function(e){

        e.preventDefault();

        var url = "http://tads-trello.herokuapp.com/api/trello/users/new";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
           if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            $("#modalSuccess").modal("show");
            
           }
           if (this.readyState == 4 && this.status == 400) {
            alert("Usuario ja cadastrado");
           }
        }

        let dados = {
            
            name: document.getElementById("name").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value

        };

        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(dados));
        

    })
}