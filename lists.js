

const Board_id = window.location.href.split("?")[1];
const User_id  = sessionStorage.getItem("token");
let idMove;
console.log(User_id);
atvToken();
 

$(document).ready(function(){
  $("#exampleModal").on('hidden.bs.modal', function(){
    document.getElementById("renameCard").classList.remove("invisible-add");
    document.getElementById("formRenameCard").classList.add("invisible-add");
    document.getElementById("redateCard").classList.remove("invisible-add");
    document.getElementById("formRedateCard").classList.add("invisible-add");
  });
});

function atvToken(){
  if(Board_id == undefined){
      alert("ERRO NA PAGINA");

      if(User_id == null){
        window.location.href = "index.html";
        
      }
      else{
        window.location.href = "boards.html";
      }

  }
  else{

    carregarBoardData();
    loadLists(Board_id, User_id);
  }
}


function allowDrop(ev) {
    ev.preventDefault();
    
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    let el = [...document.getElementsByName("text-add")]
    el.forEach((e)=>{
      e.classList.remove("invisible-add");
    })
  }

  function dragend(ev){
    let el = [...document.getElementsByName("text-add")]
    el.forEach((e)=>{
      e.classList.add("invisible-add");
    })
  }
  
  function drop(ev) {
    ev.preventDefault();
    let card = document.getElementById(ev.dataTransfer.getData("text"));
    let cardId = card.getAttribute("cardid");
    //console.log(card)
    //console.log(cardId)
    let listId; 

    if(ev.target.getAttribute("dropable") == "true"){
        
      ev.target.insertAdjacentElement("beforebegin", card);
      //console.log(ev.target)
      listId = ev.target.getAttribute("listId")
    }

    if(ev.target.getAttribute("dropable") == "true-secondary"){
      
      ev.target.parentElement.insertAdjacentElement("beforebegin", card);
      //console.log(ev.target.parentElement)
      listId = ev.target.parentElement.getAttribute("listId");
    }

    let url = "https://tads-trello.herokuapp.com/api/trello/cards/changelist";
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let obj = JSON.parse(this.responseText);
        } 
    }
    
    let change = {
        token: User_id,
        card_id: cardId,
        list_id: listId
    };

      xhttp.open("PATCH", url, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      console.log(change);
      xhttp.send(JSON.stringify(change));


    
  }

  
  
  
  function adicionarList(){
    
    let inputText = document.getElementById("newListText");
    if (inputText.value.length > 0){

      let url = "https://tads-trello.herokuapp.com/api/trello/lists/new";
      let xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            //console.log(obj)
            //console.log("funcionou")
            loadLists(Board_id, User_id);
            inputText.value = "";
          }
          if (this.readyState == 4 && this.status == 400) {
            alert("Board ja cadastrado");
          }
      }

      let List = {
          
          name: inputText.value,
          token: User_id,
          board_id: Board_id
          

      };

        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        //console.log(List);
        xhttp.send(JSON.stringify(List));

    }else{
      inputText.classList.add("is-invalid")
      setTimeout(() => inputText.classList.remove("is-invalid"), 3000)
    }
    
  }


  



  function newCard(id){

    let inputText = document.getElementById(`newCardText${id}`);

    if (inputText.value.length > 0){

      let xhttp = new XMLHttpRequest();
      let url = `https://tads-trello.herokuapp.com/api/trello/cards/new`;
      //console.log(url);
      //{ "name": "Card 1", "data": "dd/mm/yyyy", "token": "PAposhSCEzRouxtck6rgsP", "list_id": "1", }
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let dataBoard = JSON.parse(this.responseText);
          console.log(dataBoard);
          loadCards(User_id, id);
          inputText.value = "";
        };  
      }

      let hj = new Date();
      hj = `${hj.getDay()}/${hj.getDate()}/${hj.getFullYear()}`

      let Card = {
        name: inputText.value,
        data: hj,
        token: User_id,
        list_id: id
      };

      console.log(Card);

      xhttp.open("POST", url, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(Card));
      inputText.value = "";
      }
      
      else{
        inputText.classList.add("is-invalid")
        setTimeout(() => inputText.classList.remove("is-invalid"), 3000)
      }
  }

  

  function carregarBoardData(){
    let xhttp = new XMLHttpRequest();
    let url = `https://tads-trello.herokuapp.com/api/trello/boards/${User_id}/${Board_id}`;
    //console.log(url);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        let dataBoard = JSON.parse(this.responseText)[0];
        //console.log(dataBoard);
        document.getElementById("nameBoard").innerText = dataBoard.name;
        document.body.style.backgroundColor = dataBoard.color;


      };  
    }
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  function deletList(id){
    let xhttp = new XMLHttpRequest();
    let url = "https://tads-trello.herokuapp.com/api/trello/lists/delete";
    console.log(url);
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {  
        loadLists(Board_id, User_id);
      };  
    };

    let listDelet = {     
      list_id: `${id}`,
      token: User_id
    };

    console.log(JSON.stringify(listDelet));
    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(listDelet));
  }




  function ranameList(id){
    
    let inputRename= document.getElementById(`InpRenameList${id}`);
    console.log(inputRename);
    let xhttp = new XMLHttpRequest();
    let url = "https://tads-trello.herokuapp.com/api/trello/lists/rename";

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        loadLists(Board_id, User_id);
        
      };  
    }

    let rename = {
      list_id: `${id}`,
      name: inputRename.value,
      token: User_id
    };
    //console.log(inputRename.value.length)
    if(inputRename.value.length > 0){

      document.getElementById(`InpRenameList${id}`).classList.add("invisible-add");
      document.getElementById(`nameList${id}`).classList.remove("invisible-add");
      document.getElementById(`InpRenameList${id}`).innerText = document.getElementById(`nameList${id}`).value;
      document.getElementById(`saveBtn${id}`).classList.add("invisible-add");
      
      xhttp.open("PATCH", url, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(rename));

      
    }
    else{
        inputRename.classList.add("is-invalid")
        setTimeout(() => inputRename.classList.remove("is-invalid"), 3000)
      }
    
}

function deletCard(event, id){
  event.stopPropagation();

  let xhttp = new XMLHttpRequest();
    let url = "https://tads-trello.herokuapp.com/api/trello/cards/delete";
    
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {  
        loadLists(Board_id, User_id);
      };  
    };

    let cardDelet = {     
      card_id: `${id}`,
      token: User_id
    };

    console.log(JSON.stringify(cardDelet));
    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(cardDelet));
}





function checkTag(event){

  card_id = document.getElementById("exampleModal").getAttribute("cardid");
  tagid = event.target.getAttribute("tagid");
 

  let tag = event.target;

  let value = tag.getAttribute("chk");
  //console.log(value)

  if(value == "true"){
      //tag.classList.add("tag-off");
      //tag.setAttribute("chk", "false");
      //remove tag

  }

  else{
      tag.classList.remove("tag-off");
      tag.setAttribute("chk", "true");
      addTag(card_id, tagid);
      
  }
}

function addTag(cardid, tagid){

    let xhttp = new XMLHttpRequest();
    let url = `https://tads-trello.herokuapp.com/api/trello/cards/addtag`;
   
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //console.log("foi");
       };  
    }

    let tag = {
      card_id: cardid,
      tag_id: tagid,
      token: User_id,
    };


    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(tag));
    
    
}

function removeTag(card){};

function callModalCard(name, id, date){
  let xhttp = new XMLHttpRequest();
  let url = `https://tads-trello.herokuapp.com/api/trello/cards/${User_id}/${id}/tags`;
  let arrayTags;
  

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("nameModal").innerText = name;
      document.getElementById("dateModal").innerText = date;
      document.getElementById("exampleModal").setAttribute("cardId", id);
      document.getElementById("btComent").setAttribute("cardId", id);
      document.getElementById("btRenameCard").setAttribute("cardId", id);
      document.getElementById("btRedateCard").setAttribute("cardId", id);

      arrayTags = new Array();
      arrayTags =  JSON.parse(this.responseText).map((e)=>{return e.id});
      
      let tags = [...document.getElementsByClassName("tag")];
      
      

      tags.forEach((el) => {
        
        if(arrayTags.includes(Number(el.getAttribute("tagid")))) {
          el.classList.remove("tag-off");
          el.setAttribute("chk", true);
        }
        else{
          el.classList.add("tag-off");
          el.setAttribute("chk", false);
        }
      });

      $('#exampleModal').modal('show');

      console.log(arrayTags);
      loadComents(id, User_id);
    }
  }
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}

function logoff(){
  sessionStorage.clear();
  window.location.href = "index.html";
}

function modRename(){
  document.getElementById("inpRenameCard").value = document.getElementById("nameModal").innerText;

  document.getElementById("renameCard").classList.add("invisible-add");
  document.getElementById("formRenameCard").classList.remove("invisible-add");
  
  
}

function renameCard(event){
  
    let id = event.target.getAttribute("cardId");
    let inputRename= document.getElementById("inpRenameCard");
    console.log(inputRename);
    let xhttp = new XMLHttpRequest();
    let url = "https://tads-trello.herokuapp.com/api/trello/cards/rename";

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("nameModal").innerText = document.getElementById("inpRenameCard").value;
        document.getElementById("renameCard").classList.remove("invisible-add");
        document.getElementById("formRenameCard").classList.add("invisible-add"); 
        loadLists(Board_id, User_id);
      };  
    }

    //{ "token": "PAposhSCEzRouxtck6rgsP", "card_id": "1", "name": "New card 1" }

    let rename = {
      token: User_id,
      card_id: `${id}`,
      name: inputRename.value,
      
    };
    //console.log(inputRename.value.length)
    if(inputRename.value.length > 0){

      
      xhttp.open("PATCH", url, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(rename));

      
    }
    else{
        inputRename.classList.add("is-invalid")
        setTimeout(() => inputRename.classList.remove("is-invalid"), 3000)
      }
    
}



function modRedate(){
  let valDate = document.getElementById("dateModal").innerText.split("/");
  valDate = valDate[2] + "-" + valDate[1] + "-" + valDate[0];
  document.getElementById("inpRedateCard").value = valDate;


  document.getElementById("redateCard").classList.add("invisible-add");
  document.getElementById("formRedateCard").classList.remove("invisible-add");
  
  
}



function redateCard(event){
  
  let id = event.target.getAttribute("cardId");
  let inputRedate= document.getElementById("inpRedateCard");
  console.log(inputRedate);

  let date = inputRedate.value.split("-");
  date = `${date[2]}/${date[1]}/${date[0]}`;

  let xhttp = new XMLHttpRequest();
  let url = "https://tads-trello.herokuapp.com/api/trello/cards/newdata";

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("dateModal").innerText = date;
      document.getElementById("redateCard").classList.remove("invisible-add");
      document.getElementById("formRedateCard").classList.add("invisible-add"); 
      loadLists(Board_id, User_id);
    };  
  }

  //{ "token": "PAposhSCEzRouxtck6rgsP", "card_id": "1", "data": "dd/mm/yyyy" }



  let redate = {
    token: User_id,
    card_id: `${id}`,
    data: date
    
  };
  //console.log(inputRedate.value.length)
  if(inputRedate.value.length > 0){

    
    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(redate));

    
  }
  else{
      inputRedate.classList.add("is-invalid")
      setTimeout(() => inputRedate.classList.remove("is-invalid"), 3000)
    }
  
}



function setList(id, nome){
    
    return `
            <div class="card bg-primary text-white list" >
                <div class="card-header container-fluid">
                    <div class="row">
                        <h4 class="col-10" id="nameList${id}" onclick="modRanameList(${id})">${nome}</h4>
                        <input type="text" class="col-8 form-control form-control-sm invisible-add" name="" id="InpRenameList${id}" maxlength="12" onfocusout='ranameList(${id})'>  
                        <input class="col-2 btn btn-success btn-board align-middle invisible-add" id="saveBtn${id}" type="button" value="&#x2611;" onclick='ranameList(${id})'>

                        <input class="col-2 btn btn-danger btn-board align-middle" type="button" value="&#10006;" onclick="deletList(${id})">
                    </div>
                </div>

                <ul class="list-group list-group-flush"  ondrop="drop(event)" ondragover="allowDrop(event)" id="list${id}">

                   

                    <li class="list-group-item"   dropable="true" listId="${id}">
                        <h6 name="text-add" class="text-light bcblue  invisible-add" dropable="true-secondary">Arraste aqui para transaferir</h6>
                    </li>
                </ul>
                <div class="card-footer text-light container-fluid" style="padding: 5px 25px;">
                    <div class="row">
                        <input type="text" class="form-control form-control-sm col-10" placeholder="Novo Card" id="newCardText${id}" >
                        <input name="" id="" class="btn btn-secondary col-2" type="button" value="+" onclick="newCard(${id})">
                    </div>
                </div>
            </div>
            
        `}


function divAddCard(id)  {
    return   `<li class="list-group-item bcblue"   dropable="true" listId="${id}">
    <h6 name="text-add" class="text-light  invisible-add" dropable="true-secondary">Arraste aqui para transferir</h6>
                    </li>`};






function setCard(id, text, data){

        return `<li class="list-group-item "  draggable="true" ondragstart="drag(event)" ondragend="dragend(event)" id="card${id}" dropable="false" cardid="${id}" onclick="callModalCard('${text}', ${id}, '${data}')">
                    <div class="card border-primary text-dark card-item">
                        <div class="card-body" dropable="false">
                            <div class="container-fluid">
                                <div class="row">
                                    <h6 class="card-title col-10" >${text}</h6> 
                                    <p class="col-2 delet-card" onclick="deletCard(event, ${id})">X</p>
                                </div>
                                <div class="row">
                                    <h6 class="card-subtitle mb-2 text-muted col-10">${data}</h6>
                                    <p class="col-2 delet-card" onclick="modalMoveCard(event, ${id}, '${text}')">&#8614;</p>
                                </div> 
                            </div> 
                        </div>
                    </div>
                </li>`

}


function listOption(id, name){
  return  `<li class="list-group-item optionList" onclick="moveCard(${id})">${name}</li>`

}

function modalMoveCard(event, id, name){
  document.getElementById("moverModalTitle").innerText = "Mover card " + name + " para:";
  event.stopPropagation();
  idMove = id;
  $("#modalMoverCard").modal('show');
  
 
}

function moveCard(id){
  let url = "https://tads-trello.herokuapp.com/api/trello/cards/changelist";
  let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let obj = JSON.parse(this.responseText);
          loadLists(Board_id, User_id);
          $("#modalMoverCard").modal('hide');
        } 
    }
    
    let change = {
        token: User_id,
        card_id: idMove,
        list_id: id
    };

      xhttp.open("PATCH", url, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      console.log(change);
      xhttp.send(JSON.stringify(change));


}





function setComment(text){

    return `<li class="list-group-item">${text}</li>`

}


function loadCards(token, list_id){
        let xhttp = new XMLHttpRequest();
        let url = `https://tads-trello.herokuapp.com/api/trello/cards/${token}/list/${list_id}`;

        console.log(url);

        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        let arrayCards = new Array();
        arrayCards =  JSON.parse(this.responseText);
        console.log(arrayCards);
        
        let corpoCards = document.getElementById(`list${list_id}`)


        let htmllist = "";

        arrayCards.forEach((index)=>{
            htmllist  += setCard(index.id, index.name, index.data);
        });
        
        //console.log(htmllist);
        htmllist += divAddCard(list_id);

        
        
        corpoCards.innerHTML = htmllist;
            


        };  
    }
        xhttp.open("GET", url, true);
        xhttp.send();
}

function loadLists(boardId, token){

    let xhttp = new XMLHttpRequest();
    let url = `https://tads-trello.herokuapp.com/api/trello/lists/${token}/board/${boardId}`;

    console.log(url);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        let arrayLists = new Array();
        arrayLists =  JSON.parse(this.responseText);
        //console.log(arrayLists);
        
        let corpoList = document.getElementsByClassName("corpoLists")[0];
        let optionList = document.getElementById("moverModalList");

        let htmllist = "";
        let htmloptionslist = "";


        arrayLists.forEach((index)=>{
             htmllist  += setList( index.id, index.name);
        });

        arrayLists.forEach((index)=>{
          htmloptionslist  += listOption( index.id, index.name);
        });

        
        
        //console.log(htmllist);

        optionList.innerHTML = htmloptionslist;

        corpoList.innerHTML = htmllist;
        
        arrayLists.forEach((index)=>{
            loadCards(token, index.id);
       });
        

    };  
}
    xhttp.open("GET", url, true);
    xhttp.send();
    
}

function modRanameList(id){
    document.getElementById(`InpRenameList${id}`).classList.remove("invisible-add");
    document.getElementById(`saveBtn${id}`).classList.remove("invisible-add");
    
    document.getElementById(`nameList${id}`).classList.add("invisible-add");
    document.getElementById(`InpRenameList${id}`).value = document.getElementById(`nameList${id}`).innerText;

    
}

function comentar(event){
    let card= event.target.getAttribute("cardid");
    let coment = document.getElementById("inpComent");

    
    if (coment.value.length > 0){

      let url = "https://tads-trello.herokuapp.com/api/trello/cards/addcomment";
      let xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            console.log(obj)
            loadComents(card, User_id)
            coment.value = "";
          }
          if (this.readyState == 4 && this.status == 400) {
            
          }
      }

      let comentario = {

            card_id: card,
            comment: coment.value,
            token: User_id

      };

        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        //console.log(List);
        xhttp.send(JSON.stringify(comentario));
        

    }else{
      coment.classList.add("is-invalid");
      setTimeout(() => coment.classList.remove("is-invalid"), 3000);
    }
}

function loadComents(card_id, token){

    let xhttp = new XMLHttpRequest();
    let url = `https://tads-trello.herokuapp.com/api/trello/cards/${token}/${card_id}/comments`;

    console.log(url);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        let arrayComments = new Array();
        arrayComments =  JSON.parse(this.responseText);
        //console.log(arrayLists);
        
        let campoComment = document.getElementById("campoComents");

        let htmllist = "";

        arrayComments.forEach((index)=>{
             htmllist  += setComment( index.comment);
        });
        
        //console.log(htmllist);

        campoComment.innerHTML = htmllist;
        
        
        

    };  
}
    xhttp.open("GET", url, true);
    xhttp.send();
    
}


