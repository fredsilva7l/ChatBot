const fs = require("fs");
const path = require("path");

// Função para carregar mensagens do arquivo JSON
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

// Simular o envio de mensagens (para teste)
async function simularEnvioMensagens() {
  const dataAtual = new Date().toLocaleDateString("pt-BR");
  const mensagens = carregarMensagens();

  // Procurar a mensagem correspondente à data atual
  const mensagemDoDia = mensagens.find((msg) => msg.data === dataAtual);

  if (mensagemDoDia) {
    console.log(`Mensagem encontrada para ${dataAtual}`);

    // Simular envio da mensagem principal
    if (mensagemDoDia.mensagem) {
      console.log(`${mensagemDoDia.mensagem}`);
    }

    // Simular envio da música
    if (mensagemDoDia.musica && mensagemDoDia.musica.trim() !== "") {
      console.log(`Música do dia: ${mensagemDoDia.musica}`);
    }

    // Simular envio do link
    if (mensagemDoDia.link_musica && mensagemDoDia.link_musica.trim() !== "") {
      console.log(`Ouça aqui: ${mensagemDoDia.link_musica}`);
    }
  } else {
    console.log(`Nenhuma mensagem encontrada para a data: ${dataAtual}`);
  }
}

// Executar teste
simularEnvioMensagens().catch(console.error);
