const { Client, LocalAuth } = require("whatsapp-web.js");
const schedule = require("node-schedule");
const http = require("http");

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

client.once("ready", async () => {
  schedule.scheduleJob("31 9 * * *", async () => {
    const targetNumber = "553196550903@c.us";
    await client.sendMessage(targetNumber, "Bom dia linda!");
  });
});

client.initialize();
