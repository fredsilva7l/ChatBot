const { Client, LocalAuth } = require("whatsapp-web.js");
const schedule = require("node-schedule");
const http = require("http");
const fs = require("fs");
const path = require("path");
const myNumber = "553173571193@c.us";
const targetNumber = "553171345717@c.us";

const server = http.createServer((req, res) => {
  try {
    const mensagem = req.url === "/status" ? "online" : "ChatBot rodando";
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(mensagem);
  } catch (error) {
    console.error("Erro no servidor HTTP:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Erro interno do servidor");
  }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
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
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  let mensagens;
  try {
    mensagens = carregarMensagens();
  } catch (error) {
    console.error("Erro ao carregar mensagens:", error);
    return;
  }

  let mensagemDoDia;
  try {
    mensagemDoDia = mensagens.find((msg) => msg.data === dataAtual);
  } catch (error) {
    console.error("Erro ao buscar mensagem do dia:", error);
    return;
  }

  if (mensagemDoDia) {
    console.log(
      `Enviando mensagem (${mensagemDoDia.diaSemana}) para ${targetNumber}, `
    );

    try {
      await client.sendMessage(myNumber, `Função Iniciada com sucesso!`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log("Processo finalizado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar confirmação:", error);
    }

    if (mensagemDoDia.mensagem) {
      try {
        await client.sendMessage(targetNumber, mensagemDoDia.mensagem);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("Mensagem de texto enviada");
      } catch (error) {
        console.error("Erro ao enviar mensagem de texto:", error);
      }
    }

    if (mensagemDoDia.musica && mensagemDoDia.musica.trim() !== "") {
      try {
        await client.sendMessage(targetNumber, mensagemDoDia.musica);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("Música enviada");
      } catch (error) {
        console.error("Erro ao enviar música:", error);
      }
    }

    if (mensagemDoDia.link_musica && mensagemDoDia.link_musica.trim() !== "") {
      try {
        await client.sendMessage(targetNumber, mensagemDoDia.link_musica);
        console.log("Link da música enviado");
      } catch (error) {
        console.error("Erro ao enviar link da música:", error);
      }
    }

    console.log(`Processo finalizado para ${dataAtual}`);
  } else {
    console.log(`Nenhuma mensagem encontrada para ${dataAtual}`);
    try {
      await client.sendMessage(
        myNumber,
        "Nenhuma mensagem encontrada para hoje."
      );
      console.log("Erro ao enviar mensagem para meu número");
    } catch (error) {
      console.error("Erro ao enviar mensagem para meu número:", error);
    }
  }
}

client.once("ready", async () => {
  console.log("Bot conectado e pronto para enviar mensagens!");

  try {
    await client.sendMessage(myNumber, "Bot conectado e funcionado!");
    console.log("Mensagem de conexão enviada com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
  schedule.scheduleJob("30 9 * * *", enviarMensagensDoDia);
  console.log(
    "Agendamento configurado para 06:30 (horário local) todos os dias"
  );
});

client.on("message", async (msg) => {
  try {
    await msg.reply("Esse número é só para envio de mensagens automáticas.");
  } catch (error) {
    console.error("Erro ao responder mensagem:", error);
  }
});

try {
  client.initialize();
  console.log("Inicializando cliente WhatsApp...");
} catch (error) {
  console.error("Erro na inicialização do cliente:", error);
  process.exit(1);
}
