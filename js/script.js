let username;
let toWho = 'Todos';
let whoCanSee = 'message';
let firstExecution = false;

//Tudo relacionado ao login do usuário e manter sua conexão com o servidor
function login(){
    username = document.querySelector('.username-login').value;

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name: username});

    document.querySelector('.username-login').classList.add('hidden-element');
    document.querySelector('.enter-button').classList.add('hidden-element');
    document.querySelector('.loading').classList.add('lds-roller');
    if(!document.querySelector('.username-unavailable').classList.contains('hidden-element')){
        document.querySelector('.username-unavailable').classList.add('hidden-element');
    }

    promise.then(loginSuccess);
    promise.catch(loginFailed);
}

function loginSuccess(){
    document.querySelector('.login-screen').classList.add('login-success');
    getMessages();
    getParticipants();
    setInterval(keepConnection, 5000);
    //setInterval(getMessages, 5000);
    setInterval(getParticipants, 10000);
}

function loginFailed(){
    document.querySelector('.username-login').classList.remove('hidden-element');
    document.querySelector('.enter-button').classList.remove('hidden-element');
    document.querySelector('.loading').classList.remove('lds-roller');
    document.querySelector('.username-unavailable').classList.remove('hidden-element');
}

function keepConnection(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: username});

    promise.then(connectionSuccess);
    promise.catch(connectionFailed);
}
function connectionSuccess(){
    console.log('connected');
}
function connectionFailed(){
    console.log('connection lost!');
    window.location.reload();
}

//Tudo relacionado as mensagens exibidas na tela
function getMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    //console.log(promise);
    promise.then(test);
    promise.catch(()=>{console.log('falha ao requisitar mensagens')});
}
function test(promise){
    let newData= filterMessages(promise.data);
    let messages = document.querySelector('main');
    messages.innerHTML = '';
    if(!firstExecution){
        for (let i = 0; i < newData.length; i++) {
            if (newData[i].type === 'status'){
                messages.innerHTML += `<span class="message message-status last-message"><em>(${newData[i].time})</em> <b>${newData[i].from}</b> ${newData[i].text}</span>`;
            }
            else if (newData[i].type === 'message'){
                messages.innerHTML += `<span class="message last-message"><em>(${newData[i].time})</em> <b>${newData[i].from}</b> para <b>${newData[i].to}</b>: ${newData[i].text}</span>`;
            }
            else if (newData[i].type === 'private_message') {
                messages.innerHTML += `<span class="message private-message last-message"><em>(${newData[i].time})</em> <b>${newData[i].from}</b> reservadamente para <b>${newData[i].to}</b>: ${newData[i].text}</span>`;
            }
            scrollToBottom();
        }
        //firstExecution = true;
    }
    console.log(newData);

}
/*
let oldMessages = [];
function displayMessages(promise){
    let messages = document.querySelector('main');
    let newData = filterMessages(promise.data);
    if(!firstExecution){
        for (let i = 0; i < newData.length; i++) {
            if (newData[i].type === 'status'){
                messages.innerHTML += `<span class="message message-status last-message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> ${promise.data[i].text}</span>`;
            }
            else if (newData[i].type === 'message'){
                messages.innerHTML += `<span class="message last-message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> para <b>${promise.data[i].to}</b>: ${promise.data[i].text}</span>`;
            }
            else if (newData[i].type === 'private_message') {
                messages.innerHTML += `<span class="message private-message last-message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> reservadamente para <b>${promise.data[i].to}</b>: ${promise.data[i].text}</span>`;
            }
            scrollToBottom();
        }
        firstExecution = true;
    }
    else{
        newData = compareData(oldMessages ,filterMessages(promise.data));

        if(newData.length > 0){
            for (let i = 0; i < newData.length; i++) {
                if (newData[i].type === 'status'){
                    messages.innerHTML += `<span class="message message-status"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> ${promise.data[i].text}</span>`;
                }
                else if (newData[i].type === 'message'){
                    messages.innerHTML += `<span class="message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> para <b>${promise.data[i].to}</b>: ${promise.data[i].text}</span>`;
                }
                else if (newData[i].type === 'private_message') {
                    messages.innerHTML += `<span class="message private-message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> reservadamente para <b>${promise.data[i].to}</b>: ${promise.data[i].text}</span>`;
                }
            }
            scrollToBottom();
        }
    }
    oldMessages = newData;
}
*/
function filterMessages(data){
    let arrAux = [];
    for (let i = 0; i < data.length; i++) {
        if(data[i].type === 'status' || data[i].type === 'message' || (data[i].type === 'private_message' & (data[i].from === username || data[i].to === username))){
            arrAux.push(data[i]);
        }
    }

    return arrAux;
}
function compareData(oldData, newData){
    let arrAux = [];
    for (let i = newData.length-1; i > 0; i--) {
        if(oldData[oldData.length-1] !== newData[i]){
            arrAux.unshift(newData[i]);
        }
        else if(oldData[oldData.length-1] === newData[i]){
            break;
        }
    }
    return arrAux;
}
function scrollToBottom() {
    const lastMessage = document.querySelector('main').lastChild;
    lastMessage.scrollIntoView();
 }
//Funções relacionadas ao envio de mensagens
function sendMessage(){
    const typedMessage = document.querySelector('.input-message').value;
    document.querySelector('.input-message').value = '';
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', {
        from: username,
        to: toWho,
        text: typedMessage,
        type: whoCanSee
    })
    promise.then(getMessages);
    promise.catch(()=>{
        console.log("Falha ao enviar mensagem");
        window.location.reload();
    })
}

//Funções relacionadas ao menu
function openMenu(){
    document.querySelector('.menu').style.zIndex = "3";
    
    setTimeout(() => {
        document.querySelector('.close').style.width = "31%";
        document.querySelector('.close').style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        document.querySelector('nav').style.width = "69%";
    }, 70);
}
function closeMenu(){
    document.querySelector('.close').style.width = "100%";
    document.querySelector('.close').style.backgroundColor = "rgba(0, 0, 0, 0)";
    document.querySelector('nav').style.width = "0%";
    setTimeout(() => {
        document.querySelector('.menu').style.zIndex = "-1"
    }, 500);
}

function getParticipants(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    promise.then(printParticipants);
    promise.catch(() => {console.log("Erro ao carregar lista de participantes")});
}
function printParticipants(promise){
    let participantsList = document.querySelector('.participants-list');
    if(toWho === 'Todos'){
        participantsList.innerHTML = `<li onclick="selectToWho(this)">
                                          <div>
                                              <ion-icon name="people"></ion-icon>
                                              <span class="contact-name">Todos</span>
                                          </div>
                                          <img class="selected" src="images/checkmark.png"/>
                                      </li>`;
    }
    else{
        participantsList.innerHTML = `<li onclick="selectToWho(this)">
                                          <div>
                                              <ion-icon name="people"></ion-icon>
                                              <span class="contact-name">Todos</span>
                                          </div>
                                          <img class="hidden-element" src="images/checkmark.png"/>
                                      </li>`;
    }
    for(let i = 0; i < promise.data.length; i++){
        if(toWho === promise.data[i].name){
            participantsList.innerHTML +=  `<li onclick="selectToWho(this)">
                                                <div>
                                                    <ion-icon name="person-circle"></ion-icon>
                                                    <span class="contact-name">${promise.data[i].name}</span>
                                                </div>
                                                <img class="selected" src="images/checkmark.png"/>
                                            </li>`;
        }
        else{
            participantsList.innerHTML +=  `<li onclick="selectToWho(this)">
                                                <div>
                                                    <ion-icon name="person-circle"></ion-icon>
                                                    <span class="contact-name">${promise.data[i].name}</span>
                                                </div>
                                                <img class="hidden-element" src="images/checkmark.png"/>
                                            </li>`;
        }
    }
}

function selectToWho(contact){
    toWho = contact.querySelector('.contact-name').innerHTML;
    getParticipants();
}

function selectVisibility(option){
    const options = document.querySelector(".visibility-options");
    const selectedOption = options.querySelector('.selected');
    if (selectedOption !== null) {
      selectedOption.classList.remove("selected");
    }

    option.classList.add("selected");

    if(option.querySelector('.visibility-name').innerHTML === 'Público'){
        whoCanSee = 'message';
    }
    else if(option.querySelector('.visibility-name').innerHTML === 'Reservadamente'){
        whoCanSee = 'private_message';
    }
}

//envio com enter
document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        sendMessage();
    }
  });