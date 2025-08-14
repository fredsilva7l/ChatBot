const { Client, LocalAuth } = require("whatsapp-web.js");
const schedule = require("node-schedule");
const http = require("http");
const qrcode = require("qrcode-terminal");

const server = http.createServer((req, res) => {
  const mensagem = req.url === "/status" ? "online" : "ChatBot rodando";
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(mensagem);
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.once("ready", async () => {
  console.log("Cliente pronto!");
  // Envia mensagem imediatamente ao iniciar
  await client.sendMessage(targetNumber, "Teste de funcionamento do bot");
  // Mantém o agendamento, se desejar
  schedule.scheduleJob("09 1 * * *", async () => {
    await client.sendMessage(targetNumber, "Teste agendado");
  });
});

client.initialize();
