let mensagens = [];

let nomeUsuario;

function buscarMensagens() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    console.log(promise);
    promise.then(chegou);
    promise.catch(naoChegou);
    
}

function exibirMensagemTela() {
    const lista = document.querySelector('ul');

    for (let i = 0; i < mensagens.length; i++) {
        
        let template = `
            <li data-test="message" class="msg-tela">
            (${mensagens[i].time}) ${mensagens[i].from} para ${mensagens[i].to}: ${mensagens[i].text}
            </li>
        `

        lista.innerHTML += template;
    }
    
    console.log(template);
}

buscarMensagens();

function chegou(resposta) {
    console.log('chegou');
    console.log(resposta.data);
    mensagens = resposta.data;
    exibirMensagemTela();
}

function naoChegou(erro) {
    console.log('não chegou');
}


function enviarNomeUsuario() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", nomeUsuario);

    promise.then(enviado);
    promise.catch(naoEnviado);
}

function enviado(resposta) {
    console.log('chegou');
}

function naoEnviado(erro) {
    console.log('nao chegou');
}