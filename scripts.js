let mensagens = []; // array que vai receber as mensagens do servidor

let nomeUsuario; // vai armazenar o nome do prompt

let objNome; // objeto com o nome de usuario que vai ser enviado pro servidor

let novaMensagem; // objeto com as novas mensagens que serão enviadas pro servidor

const lista = document.querySelector('ul');


function exibirMensagemTela() {

    lista.innerHTML = '';

    for (let i = 0; i < mensagens.length; i++) {
        
        if (mensagens[i].type === "message") {
            let template = `
                <li data-test="message" class="message msg">
                (${mensagens[i].time}) ${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}
                </li>
            `
            lista.innerHTML += template;
        }   
        
        if (mensagens[i].type === "status") {
            let status = `
                <li data-test="message" class="status msg">
                (${mensagens[i].time}) ${mensagens[i].from} ${mensagens[i].text}
                </li>
            `
            lista.innerHTML += status;
        }

        if (mensagens[i].type === "private_message" && (mensagens[i].from === nomeUsuario || mensagens[i].to === nomeUsuario)) {
            let private = `
                <li data-test="message" class="private-message msg">
                (${mensagens[i].time}) ${mensagens[i].from} reservadamente para ${mensagens[i].to}: ${mensagens[i].text}
                </li>
            `
            lista.innerHTML += private;
        }
    }

    document.querySelector('.msg:last-child').scrollIntoView();
}

// busca mensagens no servidor
function buscarMensagens() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.then(buscouMensagem);
    promise.catch(naoBuscouMensagem);
}

function buscouMensagem(resposta) {
    console.log('chegou requerimento para buscar mensagens');
    console.log(resposta.data);
    mensagens = resposta.data;
    exibirMensagemTela();
}

function naoBuscouMensagem(erro) {
    console.log('não chegou requerimento para buscar mensagens');
}



function entrarNaSala() {
    nomeUsuario = prompt("Digite seu nome");
    objNome = {name: nomeUsuario};

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objNome);

    promise.then(enviouNomeUsuario);
    promise.catch(naoEnviouNomeUsuario);
}

function enviouNomeUsuario(resposta) {
    console.log('chegou o nome de usuario');
}

function naoEnviouNomeUsuario(erro) {
    console.log('nao chegou o nome de usuario');
    window.location.reload(); // trocar depois
}


function verificaConexao() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objNome)

    promise.then(chegouConexao);
    promise.catch(naoChegouConexao);
}

function chegouConexao(resposta) {
    console.log('online');
}

function naoChegouConexao(erro) {
    console.log('offline');
}

function enviarMensagem(){
    const message = document.querySelector('textarea');
    novaMensagem ={
        from: nomeUsuario,
        to: "Todos",
        text: message.value,
        type: "message",
    }
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem)

    promise.then(chegouMensagem);
    promise.catch(naoChegouMensagem);
}

function chegouMensagem(resposta) {
    console.log('nova mensagem chegou no servidor')
}

function naoChegouMensagem(erro) {
    console.log('nova mensagem não chegou no servidor');
    window.location.reload()
}

setInterval(verificaConexao, 5000);

entrarNaSala();

setInterval(buscarMensagens, 3000);

buscarMensagens();
