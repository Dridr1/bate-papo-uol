let username;

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