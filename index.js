const http = require("http");

const PORT = process.env.PORT || 3000;
const SUCCESS_HEADERS = { "Content-Type": "text/plain" };
const SUCCESS_BODY = "online";

const server = http.createServer((req, res) => {
  res.writeHead(200, SUCCESS_HEADERS);
  res.end(SUCCESS_BODY);
});

server.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

const { Client, LocalAuth } = require("whatsapp-web.js");
const schedule = require("node-schedule");

const myNumber = "553173571193@c.us";
const targetNumber = "553171345717@c.us";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
});

client.once("ready", () => {
  schedule.scheduleJob("30 9 * * *", enviarMensagemDia);
  console.log("Agendamento de envio configurado para 09:30");
});

client.initialize()
.then(() => {
  console.log("Cliente WhatsApp inicializado com sucesso!");
})
.catch((error) => {
  console.error("Erro ao inicializar o cliente WhatsApp:", error);
});

async function enviarMensagemDia() {
  const dataAtual = new Date().toLocaleDateString("pt-BR");
  const mensagens = await carregarMensagens();
  const mensagemDoDia = mensagens.find((msg) => msg.data === dataAtual);

  console.log(`Enviando (${mensagemDoDia.diaSemana}) para ${targetNumber}, `);

  await client.sendMessage(myNumber, `Função Iniciada com sucesso!`);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log("Processo iniciado com sucesso!");

  await client.sendMessage(targetNumber, mensagemDoDia.mensagem);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log(`Mensagem de texto enviada: ${mensagemDoDia.mensagem}`);

  await client.sendMessage(targetNumber, mensagemDoDia.musica);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log(`Música enviada: ${mensagemDoDia.musica}`);

  await client.sendMessage(targetNumber, mensagemDoDia.link_musica);
  console.log(`Link da música enviado: ${mensagemDoDia.link_musica}`);
}

async function carregarMensagens() {
  const url =
    "https://raw.githubusercontent.com/fredsilva7l/ChatBot/main/mensagens.json";

  const response = await fetch(url);
  const data = await response.json();

  return data;
}
