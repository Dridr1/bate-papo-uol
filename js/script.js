let username;
let toWho = 'Todos';
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

    setInterval(keepConnection, 5000);
    setInterval(getMessages, 3000);
    setInterval(getParticipants, 3000);
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
}

//Tudo relacionado as mensagens exibidas na tela

function getMessages(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    console.log(promise);
    promise.then(displayMessages);
}

function displayMessages(promise){
    document.querySelector('main').innerHTML = '';
    for(let i = 0; i < promise.data.length; i++){
        let text;
        
        if(promise.data[i].type === 'status'){
            if(i === (promise.data.length-1)){
                text = `<span class="message message-status last-message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> ${promise.data[i].text}</span>`;
            }
            else{
                text = `<span class="message message-status"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> ${promise.data[i].text}</span>`;
            }
        }
        else if(promise.data[i].type === 'message'){
            if(i === (promise.data.length-1)){
                text = `<span class="message last-message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> para <b>${promise.data[i].to}</b>: ${promise.data[i].text}</span>`;
            }
            else{
                text = `<span class="message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> para <b>${promise.data[i].to}</b>: ${promise.data[i].text}</span>`;
            }
        }
        else if(promise.data[i].type === 'private_message' && promise.data[i].to === username){
            if(i === (promise.data.length-1 )){
                text = `<span class="message private-message last-message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> reservadamente para <b>${promise.data[i].to}</b>: ${promise.data[i].text}</span>`;
            }
            else{
                text = `<span class="message private-message"><em>(${promise.data[i].time})</em> <b>${promise.data[i].from}</b> reservadamente para <b>${promise.data[i].to}</b>: ${promise.data[i].text}</span>`;
            }
        }
        document.querySelector('main').innerHTML+=text;
    }
    let elemento = document.querySelector('.last-message');
    elemento.scrollIntoView();
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
    participantsList.innerHTML = `<li>
                                      <div>
                                          <ion-icon name="people"></ion-icon>
                                          <span class="contact-name">Todos</span>
                                      </div>
                                      <img class="hidden-element" src="images/checkmark.png"/>
                                  </li>`;
    for(let i = 0; i < promise.data.length; i++){
        participantsList.innerHTML +=  `<li>
                                            <div>
                                                <ion-icon name="person-circle"></ion-icon>
                                                <span class="contact-name">${promise.data[i].name}</span>
                                            </div>
                                            <img class="hidden-element" src="images/checkmark.png"/>
                                        </li>` 
    }
}
