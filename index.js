const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const schedule = require("node-schedule");

// Criar uma nova instância do cliente
const client = new Client({
  authStrategy: new LocalAuth(),
});

// Quando o cliente estiver pronto, execute este código (apenas uma vez)
client.once("ready", async () => {
  console.log("Serviço funcionando!");

  // Agendar mensagem para as 10:05 do horário de Brasília
  schedule.scheduleJob('51 11 * * *', async () => {
    try {
      const targetNumber = '553182777939@c.us';
      await client.sendMessage(targetNumber, 'teste de envio de mensagem agendada');
      console.log('Mensagem agendada enviada às 10:06 para:', targetNumber);
    } catch (error) {
      console.error('Erro ao enviar mensagem agendada:', error);
    }
  });

  console.log('Agendamento criado: mensagem será enviada às 10:05 todos os dias');
});

// Quando o cliente receber o código QR
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message_create", (message) => {
  // Obter o número do contato (remover @ e domínio se presente)
  const fromNumber = message.from.replace('@c.us', '').replace('@g.us', '');
  
  // Verificar se a mensagem é do número específico
  if (fromNumber === '553173571193') {
    console.log('Mensagem do número alvo:', message.body);
  }
});

// Inicializar seu cliente
client.initialize();