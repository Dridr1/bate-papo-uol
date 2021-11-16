let username;
let toWho = 'Todos';
let whoCanSee = 'message';
let firstExecution = false;
let oldMessages = [{from: 'controle', to: 'controle', text: 'controle', type: 'controle', time: 'controle'}];

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
    setInterval(getMessages, 3000);
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
function getMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promise.then(displayMessages);
    promise.catch(()=>{console.log('falha ao requisitar mensagens')});
}
function displayMessages(promise){
    let messages = document.querySelector('main');
    let newData = filterMessages(promise.data);
    let isThereNewContent = true;
    let lastOldMessage = oldMessages[oldMessages.length-1];
    let lastNewMessage = newData[newData.length-1];
    if(lastOldMessage.from === lastNewMessage.from && lastOldMessage.type === lastNewMessage.type && lastOldMessage.time === lastNewMessage.time && lastOldMessage.text === lastNewMessage.text){
        isThereNewContent = false
    }
    if(isThereNewContent){
        messages.innerHTML = '';
        for (let i = 0; i < newData.length; i++) {
            if (newData[i].type === 'status'){
                messages.innerHTML += `<span data-identifier="message" class="message message-status last-message"><em>(${newData[i].time})</em> <b>${newData[i].from}</b> ${newData[i].text}</span>`;
            }
            else if (newData[i].type === 'message'){
                messages.innerHTML += `<span data-identifier="message" class="message last-message"><em>(${newData[i].time})</em> <b>${newData[i].from}</b> para <b>${newData[i].to}</b>: ${newData[i].text}</span>`;
            }
            else if (newData[i].type === 'private_message') {
                messages.innerHTML += `<span data-identifier="message" class="message private-message last-message"><em>(${newData[i].time})</em> <b>${newData[i].from}</b> reservadamente para <b>${newData[i].to}</b>: ${newData[i].text}</span>`;
            }
        }
        const lastMessage = document.querySelector('main').lastChild;
        lastMessage.scrollIntoView();
    }
    oldMessages = newData;
}
function filterMessages(data){
    let arrAux = [];
    for (let i = 0; i < data.length; i++) {
        if(data[i].type === 'status' || data[i].type === 'message' || (data[i].type === 'private_message' & (data[i].from === username || data[i].to === username))){
            arrAux.push(data[i]);
        }
    }
    return arrAux;
}
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
    if(whoCanSee === 'private_message'){
        document.querySelector('.message-detail').innerHTML = `Enviando para ${toWho} (reservadamente)`;
    }
    else if(whoCanSee === 'message' && toWho !== 'Todos'){
        document.querySelector('.message-detail').innerHTML = `Enviando para ${toWho} (público)`;
    }
    else{
        document.querySelector('.message-detail').innerHTML = '';
    }
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
            participantsList.innerHTML +=  `<li class="selected" onclick="selectToWho(this)">
                                                <div>
                                                    <ion-icon name="person-circle"></ion-icon>
                                                    <div class="contact-span"><span class="contact-name">${promise.data[i].name}</span><div>
                                                </div>
                                                <img src="images/checkmark.png"/>
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
document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        sendMessage();
    }
  });