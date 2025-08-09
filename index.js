const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const schedule = require("node-schedule");
const http = require("http");

// Servidor HTTP para manter serviço ativo e rota de status
const server = http.createServer((req, res) => {
  if (req.url === "/status") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("online");
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ChatBot rodando");
  }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

// Instância do cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.once("ready", async () => {
  console.log("Serviço funcionando!");

  // Log a cada 5 segundos
  setInterval(() => {
    console.log('Bot está rodando:', new Date().toISOString());
  }, 5000);

  // Envio de mensagem a cada 30 segundos
  setInterval(async () => {
    try {
      const targetNumber = '553173571193@c.us';
      await client.sendMessage(targetNumber, 'Mensagem automática de teste a cada 30 segundos');
      console.log('Mensagem enviada a cada 30 segundos para:', targetNumber);
    } catch (error) {
      console.error('Erro ao enviar mensagem automática:', error);
    }
  }, 30000);

  // Agendar mensagem para as 10:05 do horário de Brasília
  schedule.scheduleJob('55 13 * * *', async () => {
    try {
      const targetNumber = '553173571193@c.us';
      await client.sendMessage(targetNumber, 'teste de envio de mensagem agendada');
      console.log('Mensagem agendada enviada às 10:06 para:', targetNumber);
    } catch (error) {
      console.error('Erro ao enviar mensagem agendada:', error);
    }
  });

  console.log('Agendamento criado: mensagem será enviada às 10:05 todos os dias');
});

client.on("message_create", (message) => {
  // Obter o número do contato (remover @ e domínio se presente)
  const fromNumber = message.from.replace('@c.us', '').replace('@g.us', '');
  
  // Verificar se a mensagem é do número específico
  if (fromNumber === '553173571193') {
    console.log('Mensagem do número alvo:', message.body);
  }
});

client.initialize();