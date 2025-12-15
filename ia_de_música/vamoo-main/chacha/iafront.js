const textoprompt = document.getElementById('textoprompt');
const acoes = document.getElementById('acoes');
const enviar = document.getElementById('enviar');
const Enter = document.getElementById('enter');
const primeiramsg = document.getElementById('primeiramsg');
const chat = document.getElementById('chatbot');

let buffer;

/* ─────────────────────────────────────────────
   HISTÓRICO
───────────────────────────────────────────── */

function historicoDePerguntas(pergunta) {
  let referencia;

  if (!primeiramsg.classList.length) {
    primeiramsg.classList.add('pergunta');
    primeiramsg.textContent = pergunta;
    referencia = primeiramsg;
  } else {
    const div = document.createElement('div');
    div.classList.add('pergunta');
    div.textContent = pergunta;
    acoes.append(div);
    referencia = div;
  }

  acoes.scrollTop = acoes.scrollHeight;
}

function historicoDeRespostas(resposta, div) {
  for (let i = 0; i < 3; i++) div.removeChild(div.firstChild);
  div.classList.remove('respondendo');
  div.classList.add('resposta');
  div.textContent = resposta;

  acoes.scrollTop = acoes.scrollHeight;
}

/* ─────────────────────────────────────────────
   PERGUNTAR
───────────────────────────────────────────── */

async function perguntar() {
  const respondendo = document.createElement('div');
  for (let i = 0; i < 3; i++) {
    const pontinho = document.createElement('span');
    respondendo.appendChild(pontinho);
  }
  respondendo.classList.add('respondendo');
  acoes.append(respondendo);

  try {
    const formData = new FormData();

    if (buffer && buffer.trim() !== "") {
      formData.append("texto", buffer);
    }

    const resposta = await fetch("http://127.0.0.1:8000/", {
      method: "POST",
      body: formData
    });

    const dados = await resposta.json();
    historicoDeRespostas(dados.response, respondendo);

  } catch (error) {
    respondendo.classList.remove('respondendo');
    respondendo.classList.add('erro');
    respondendo.textContent = "desculpe, houve um erro";
  }
}

/* ─────────────────────────────────────────────
   ENVIAR
───────────────────────────────────────────── */

function enviarMensagem() {
  if (!Enter.classList.contains('bx-send') || enviar.disabled) return;

  buffer = textoprompt.value;
  if (!buffer.trim()) return;

  textoprompt.value = '';
  textoprompt.style.height = '1rem';
  textoprompt.focus();
  Enter.classList.remove('bx-send');

  historicoDePerguntas(buffer);
  perguntar();
}

/* ─────────────────────────────────────────────
   ESTADO DO BOTÃO
───────────────────────────────────────────── */

function atualizarEstadoEnvio() {
  const temTexto = textoprompt.value.trim() !== "";

  if (temTexto) {
    Enter.classList.add('bx-send');
    enviar.removeAttribute('disabled');
  } else {
    Enter.classList.remove('bx-send');
    enviar.setAttribute('disabled', '');
  }
}

/* ─────────────────────────────────────────────
   EVENTOS
───────────────────────────────────────────── */

textoprompt.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();
  }
});

textoprompt.addEventListener('input', () => {
  textoprompt.style.height = '1rem';
  textoprompt.style.height = textoprompt.scrollHeight + 'px';
  atualizarEstadoEnvio();
});

Enter.addEventListener('click', enviarMensagem);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();
  }
});
