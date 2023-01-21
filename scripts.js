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

setInterval(buscarMensagens, 3000);

buscarMensagens();
