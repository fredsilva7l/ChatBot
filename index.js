const { Client, LocalAuth } = require("whatsapp-web.js");
const schedule = require("node-schedule");
const http = require("http");
const fs = require("fs");
const path = require("path");

const myNumber = "553173571193@c.us";
const targetNumber = "553171345717@c.us";
const PORT = process.env.PORT || 3000;

let isReconnecting = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

const client = new Client({
  authStrategy: new LocalAuth(),
});

async function verificarConexao() {
  try {
    if (!client || !client.info) {
      console.log("Cliente ainda não inicializado");
      return false;
    }

    const state = await client.getState();
    if (state !== "CONNECTED") {
      console.log(`WhatsApp não conectado. Estado atual: ${state}`);
      return false;
    }
    return true;
  } catch (error) {
    console.log("Erro ao verificar conexão:", error);
    return false;
  }
}

function carregarMensagens() {
  try {
    const mensagensPath = path.join(__dirname, "mensagens.json");

    if (!fs.existsSync(mensagensPath)) {
      console.log(
        "Arquivo mensagens.json não encontrado. Criando array vazio."
      );
      return [];
    }

    const dados = fs.readFileSync(mensagensPath, "utf8");

    if (!dados.trim()) {
      console.log("Arquivo mensagens.json está vazio.");
      return [];
    }

    const mensagens = JSON.parse(dados);

    if (!Array.isArray(mensagens)) {
      console.log("Formato inválido no arquivo mensagens.json.");
      return [];
    }

    return mensagens;
  } catch (error) {
    console.log("Erro ao carregar mensagens:", error);
    return [];
  }
}

async function enviarMensagensDoDia() {
  if (!(await verificarConexao())) {
    console.log("WhatsApp não conectado. Cancelando envio.");
    return;
  }

  const dataAtual = new Date().toLocaleDateString("pt-BR");
  const mensagens = carregarMensagens();

  let mensagemDoDia;
  try {
    mensagemDoDia = mensagens.find((msg) => msg.data === dataAtual);
  } catch (error) {
    console.log("Erro ao buscar mensagem do dia:", error);
    return;
  }

  if (mensagemDoDia) {
    console.log(
      `Enviando mensagem (${mensagemDoDia.diaSemana}) para ${targetNumber}, `
    );

    try {
      if (await verificarConexao()) {
        await client.sendMessage(myNumber, `Função Iniciada com sucesso!`);
      }
      await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log("Processo iniciado com sucesso!");
    } catch (error) {
      console.log("Erro ao enviar confirmação:", error);
    }

    if (mensagemDoDia.mensagem) {
      try {
        if (await verificarConexao()) {
          await client.sendMessage(targetNumber, mensagemDoDia.mensagem);
        }
        await new Promise((resolve) => setTimeout(resolve, 10000));
        console.log(`Mensagem de texto enviada: ${mensagemDoDia.mensagem}`);
      } catch (error) {
        console.log("Erro ao enviar mensagem de texto:", error);
      }
    }

    if (mensagemDoDia.musica && mensagemDoDia.musica.trim() !== "") {
      try {
        if (await verificarConexao()) {
          await client.sendMessage(targetNumber, mensagemDoDia.musica);
        }
        await new Promise((resolve) => setTimeout(resolve, 10000));
        console.log(`Música enviada: ${mensagemDoDia.musica}`);
      } catch (error) {
        console.log("Erro ao enviar música:", error);
      }
    }

    if (mensagemDoDia.link_musica && mensagemDoDia.link_musica.trim() !== "") {
      try {
        if (await verificarConexao()) {
          await client.sendMessage(targetNumber, mensagemDoDia.link_musica);
        }
        console.log(`Link da música enviado: ${mensagemDoDia.link_musica}`);
      } catch (error) {
        console.log("Erro ao enviar link da música:", error);
      }
    }

    console.log(`Processo finalizado para ${dataAtual}`);
  } else {
    console.log(`Nenhuma mensagem encontrada para ${dataAtual}`);
    try {
      if (await verificarConexao()) {
        await client.sendMessage(
          myNumber,
          "Nenhuma mensagem encontrada para hoje."
        );
      }
      console.log("Mensagem do dia não encontrada.");
    } catch (error) {
      console.log("Erro ao enviar mensagem para meu número:", error);
    }
  }
}

client.once("ready", async () => {
  console.log("Bot conectado e pronto para enviar mensagens!");
  reconnectAttempts = 0;
  isReconnecting = false;

  await new Promise((resolve) => setTimeout(resolve, 20000));

  try {
    await client.sendMessage(myNumber, "Bot conectado e funcionando!");
    console.log("Mensagem de conexão enviada com sucesso!");
  } catch (error) {
    console.log("Erro ao enviar mensagem:", error);
  }

  try {
    const job = schedule.scheduleJob("30 9 * * *", enviarMensagensDoDia);
    if (job) {
      console.log("Agendamento configurado para 09:30 todos os dias");
    } else {
      console.log("Erro: Falha ao criar o agendamento");
    }
  } catch (error) {
    console.log("Erro ao configurar agendamento:", error);
  }
});

client.on("message", async (msg) => {
  try {
    await msg.reply("Esse número é só para envio de mensagens automáticas.");
  } catch (error) {
    console.log("Erro ao responder mensagem:", error);
  }
});

client.on("disconnected", async (reason) => {
  console.log("Cliente desconectado:", reason);

  if (!isReconnecting && reconnectAttempts < maxReconnectAttempts) {
    isReconnecting = true;
    reconnectAttempts++;
    console.log(
      `Iniciando processo de reconexão... (Tentativa ${reconnectAttempts}/${maxReconnectAttempts})`
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await client.destroy();
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await client.initialize();

      console.log("Reconexão realizada com sucesso!");

      isReconnecting = false;
      reconnectAttempts = 0;
    } catch (error) {
      console.log("Erro durante reconexão:", error);
      isReconnecting = false;

      if (reconnectAttempts >= maxReconnectAttempts) {
        console.log(
          "Máximo de tentativas de reconexão atingido. Reiniciando aplicação..."
        );
        setTimeout(() => {
          process.exit(1);
        }, 2000);
      } else {
        setTimeout(() => {
          client.emit("disconnected", reason);
        }, 10000);
      }
    }
  }
});

client.on("auth_failure", (msg) => {
  console.error("Falha na autenticação:", msg);
});

client
  .initialize()
  .then(() => {
    console.log("Cliente WhatsApp inicializado com sucesso!");
  })
  .catch((error) => {
    console.log("Erro na inicialização do cliente:", error);
    process.exit(1);
  });

const server = http.createServer((req, res) => {
  try {
    const mensagem = req.url === "/status" ? "online" : "ChatBot rodando";
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(mensagem);
  } catch (error) {
    console.log("Erro no servidor HTTP:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Erro interno do servidor");
  }
});
server.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});
