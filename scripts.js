// array que vai receber as mensagens do servidor
let mensagens = [];

// vai armazenar o nome do prompt
let nomeUsuario; 

// objeto com o nome de usuario que vai ser enviado pro servidor
let objNome;

// objeto com as novas mensagens que serão enviadas pro servidor
let novaMensagem;

const tempoVerificaConexao = 5000;

const atualizaMensagem = 3000;

const lista = document.querySelector('ul');

const areaDigitacao = document.querySelector('textarea');

function logar() {
    nomeUsuario = prompt("Digite seu nome");
    objNome = {name: nomeUsuario};
}

logar();

function entrarNaSala() {

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objNome);

    promise.then(enviouNomeUsuario);
    promise.catch(naoEnviouNomeUsuario);
}

function enviouNomeUsuario(resposta) {
    console.log('chegou o nome de usuario');
    buscarMensagens();
}

function naoEnviouNomeUsuario(erro) {
    console.log('nao chegou o nome de usuario');
    alert("Digite outro nome. Esse já está em uso");
    logar();
    entrarNaSala();
}

entrarNaSala();

function exibirMensagemTela() {

    lista.innerHTML = '';

    for (let i = 0; i < mensagens.length; i++) {
        
        if (mensagens[i].type === "message") {
            let template = `
                <li data-test="message" class="message msg">
                    <p><span class="tempo">(${mensagens[i].time})</span>    <span>${mensagens[i].from}</span> para <span>${mensagens[i].to}</span>: ${mensagens[i].text}</p>
                </li>
            `
            lista.innerHTML += template;
        }
        
        if (mensagens[i].type === "status") {
            const status = `
                <li data-test="message" class="status msg">
                    <p><span class="tempo">(${mensagens[i].time})</span>    <span>${mensagens[i].from}</span> ${mensagens[i].text}</p>
                </li>
            `
            lista.innerHTML += status;
        }

        if (mensagens[i].type === "private_message" && (mensagens[i].from === nomeUsuario || mensagens[i].to === nomeUsuario)) {
            const privado = `
                <li data-test="message" class="private-message msg">
                    <p><span class="tempo">(${mensagens[i].time})</span>   a <span>${mensagens[i].from}</span> reservadamente para <span>${mensagens[i].to}</span>: ${mensagens[i].text}</p>
                </li>
            `
            lista.innerHTML += privado;
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


function verificaConexao() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objNome);

    promise.then(chegouConexao);
    promise.catch(naoChegouConexao);
}

function chegouConexao(resposta) {
    console.log('online');
    console.log(resposta.data);
}

function naoChegouConexao(erro) {
    console.log('offline');
    console.log(erro.response.status);
}

function enviarMensagem(){
    const message = document.querySelector('textarea');
    novaMensagem ={
        from: nomeUsuario,
        to: "Todos",
        text: message.value,
        type: "message",
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", novaMensagem);

    promise.then(chegouMensagem);
    promise.catch(naoChegouMensagem);

    areaDigitacao.value = '';
}

function chegouMensagem(resposta) {
    console.log('nova mensagem chegou no servidor');
    buscarMensagens();
}

function naoChegouMensagem(erro) {
    console.log('nova mensagem não chegou no servidor');
    window.location.reload();
}

setInterval(verificaConexao, tempoVerificaConexao);

setInterval(buscarMensagens, atualizaMensagem);
