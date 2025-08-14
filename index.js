const { Client, LocalAuth } = require("whatsapp-web.js");
const schedule = require("node-schedule");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const mensagem = req.url === "/status" ? "online" : "ChatBot rodando";
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(mensagem);
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
});

const client = new Client({
  authStrategy: new LocalAuth(),
});

function carregarMensagens() {
  try {
    const mensagensPath = path.join(__dirname, "mensagens.json");
    const dados = fs.readFileSync(mensagensPath, "utf8");
    return JSON.parse(dados);
  } catch (error) {
    console.error("Erro ao carregar mensagens:", error);
    return [];
  }
}

async function enviarMensagensDoDia() {
  const targetNumber = "553173571193@c.us";
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const mensagens = carregarMensagens();

  const mensagemDoDia = mensagens.find(msg => msg.data === dataAtual);

  if (mensagemDoDia) {
    console.log(`📤 Enviando mensagens para ${dataAtual} (${mensagemDoDia.diaSemana})`);

    if (mensagemDoDia.mensagem) {
      await client.sendMessage(targetNumber, mensagemDoDia.mensagem);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (mensagemDoDia.musica && mensagemDoDia.musica.trim() !== "") {
      await client.sendMessage(targetNumber, mensagemDoDia.musica);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (mensagemDoDia.link_musica && mensagemDoDia.link_musica.trim() !== "") {
      await client.sendMessage(targetNumber, mensagemDoDia.link_musica);
    }

    console.log(`✅ Mensagens enviadas com sucesso para ${dataAtual}`);
  } else {
    console.log(`⚠️ Nenhuma mensagem encontrada para ${dataAtual}`);
  }
}

client.once("ready", async () => {
  console.log("✅ Bot conectado e pronto para enviar mensagens!");

  const targetNumber = "553173571193@c.us";
  await client.sendMessage(targetNumber, "Bot conectado e funcionado!");

  schedule.scheduleJob("50 15 * * *", enviarMensagensDoDia);
  console.log("⏰ Agendamento configurado para 12:27 (horário local) todos os dias");
});

client.on("message", async (msg) => {
  await msg.reply("Esse número é só para envio de mensagens");
});

client.initialize();
