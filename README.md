# ChatBot WhatsApp - Mensagens Automáticas

Este é um bot do WhatsApp que envia mensagens automáticas diariamente baseadas em um arquivo JSON com mensagens programadas.

## 🚀 Funcionalidades

- ✅ Envio automático de mensagens diárias às 10:00
- 📅 Busca mensagens por data atual
- 🎵 Envia 3 tipos de mensagem: texto principal, música e link da música
- 📱 Integração completa com WhatsApp Web
- 🔄 Sistema de agendamento com node-schedule

## 📋 Como Funciona

1. **Verificação de Data**: O bot usa `new Date().toLocaleDateString('pt-BR')` para obter a data atual
2. **Busca no JSON**: Procura no arquivo `mensagens.json` por uma entrada com a data correspondente
3. **Envio Sequencial**: Envia as mensagens na seguinte ordem:
   - Mensagem principal (campo `mensagem`)
   - Música do dia (campo `musica`) - se disponível
   - Link da música (campo `link_musica`) - se disponível e não for placeholder

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o número de destino no código (já está configurado para `553173571193@c.us`)

## ▶️ Execução

### Modo Normal
```bash
npm start
```

### Teste da Lógica (sem WhatsApp)
```bash
node teste.js
```

## 📊 Estrutura do JSON

Cada mensagem no arquivo `mensagens.json` deve ter a seguinte estrutura:

```json
{
    "posição": 1,
    "diaSemana": "Quinta-feira",
    "mensagem": "Texto da mensagem principal",
    "musica": "Nome da música - Artista",
    "link_musica": "https://link-da-musica.com",
    "data": "14/08/2025"
}
```

## ⏰ Agendamento

- **Horário padrão**: 10:00 todos os dias
- **Formato**: Cron job usando node-schedule
- **Expressão**: `"00 10 * * *"`

Para alterar o horário, modifique a linha no `index.js`:
```javascript
schedule.scheduleJob("00 10 * * *", enviarMensagensDoDia);
```

## 🔧 Teste Imediato

Para testar o envio imediato (útil para desenvolvimento), descomente a linha no `index.js`:
```javascript
// await enviarMensagensDoDia();
```

## 📝 Logs

O sistema fornece logs detalhados:
- ✅ Confirmação de mensagens enviadas
- 📅 Data verificada
- 🔍 Resultado da busca no JSON
- ❌ Erros de envio ou mensagem não encontrada

## 🎯 Exemplo de Funcionamento

Para a data `14/08/2025`, o bot enviará:

1. **Mensagem Principal**: "Oi mb. Nesta quinta, deixo no ar um carinho só pra você."
2. **Música**: "🎵 Música do dia: Abril - ANAVITÓRIA"
3. **Link**: "🔗 Ouça aqui: https://open.spotify.com/intl-pt/track/66rU4Dff6qFAhia56xRs8E"

## 📦 Dependências

- `whatsapp-web.js`: Integração com WhatsApp Web
- `node-schedule`: Agendamento de tarefas
- `fs`: Leitura do arquivo JSON
- `path`: Manipulação de caminhos de arquivo

## 🔒 Autenticação

O bot usa `LocalAuth` para manter a sessão do WhatsApp. Na primeira execução, será necessário escanear o QR Code.

## 🌐 Servidor HTTP

O bot também inicia um servidor HTTP na porta 3000 (ou PORT do ambiente) para verificação de status:
- `http://localhost:3000/status` - Retorna "online"
- `http://localhost:3000/` - Retorna "ChatBot rodando"