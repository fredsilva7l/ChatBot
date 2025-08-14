const fs = require('fs');
const path = require('path');

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
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const mensagens = carregarMensagens();
  
  console.log(`\n🔍 Verificando mensagens para a data: ${dataAtual}`);
  console.log(`📊 Total de mensagens no arquivo: ${mensagens.length}`);
  
  // Procurar a mensagem correspondente à data atual
  const mensagemDoDia = mensagens.find(msg => msg.data === dataAtual);
  
  if (mensagemDoDia) {
    console.log(`\n✅ Mensagem encontrada para ${dataAtual}:`);
    console.log(`📅 Dia da semana: ${mensagemDoDia.diaSemana}`);
    console.log(`📍 Posição: ${mensagemDoDia.posição}`);
    
    console.log('\n📤 Simulando envio das mensagens:');
    
    // Simular envio da mensagem principal
    if (mensagemDoDia.mensagem) {
      console.log('\n1️⃣ MENSAGEM PRINCIPAL:');
      console.log(`   📱 "${mensagemDoDia.mensagem}"`);
    }
    
    // Simular envio da música
    if (mensagemDoDia.musica && mensagemDoDia.musica.trim() !== "") {
      console.log('\n2️⃣ MÚSICA:');
      console.log(`   🎵 "Música do dia: ${mensagemDoDia.musica}"`);
    } else {
      console.log('\n2️⃣ MÚSICA:');
      console.log('   ⏭️ Nenhuma música definida para hoje');
    }
    
    // Simular envio do link
    if (mensagemDoDia.link_musica && 
        mensagemDoDia.link_musica.trim() !== "" && 
        !mensagemDoDia.link_musica.includes("futuramente")) {
      console.log('\n3️⃣ LINK DA MÚSICA:');
      console.log(`   🔗 "Ouça aqui: ${mensagemDoDia.link_musica}"`);
    } else {
      console.log('\n3️⃣ LINK DA MÚSICA:');
      console.log('   ⏭️ Link ainda não disponível');
    }
    
    console.log('\n✅ Todas as mensagens foram simuladas com sucesso!');
    
  } else {
    console.log(`\n❌ Nenhuma mensagem encontrada para a data: ${dataAtual}`);
    console.log('\n📋 Datas disponíveis no arquivo:');
    mensagens.forEach(msg => {
      console.log(`   • ${msg.data} (${msg.diaSemana})`);
    });
  }
}

// Executar teste
console.log('🚀 TESTE DO SISTEMA DE MENSAGENS AUTOMÁTICAS');
console.log('============================================');
simularEnvioMensagens().catch(console.error);
