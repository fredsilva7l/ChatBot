# ChatBot WhatsApp Automatizado

## CONTEXTO
Aplicação Node.js que envia mensagens automáticas via WhatsApp Web diariamente às 09:30h.

## FUNCIONALIDADE PRINCIPAL
- **Bot romântico** que envia mensagens de bom dia personalizadas
- **Integração WhatsApp Web** usando whatsapp-web.js
- **Agendamento automático** com node-schedule
- **Banco de dados JSON** com mensagens pré-definidas por data

## ESTRUTURA TÉCNICA
- **Servidor HTTP** na porta 3000 (health check)
- **Cliente WhatsApp** com autenticação local persistente
- **Job agendado** executa diariamente às 09:30
- **Fonte de dados** remota (GitHub raw)

## FLUXO DE EXECUÇÃO
1. Conecta ao WhatsApp Web via Puppeteer
2. Agenda job para 09:30 todos os dias
3. No horário programado:
   - Busca mensagens do GitHub (mensagens.json)
   - Filtra mensagem pela data atual
   - Envia sequencialmente: confirmação + mensagem + música + link Spotify
   - Aplica delay de 10s entre envios

## DADOS
- **Formato das mensagens**: JSON com data, dia da semana, mensagem, música e link Spotify

## ARQUIVOS CHAVE
- `index.js`: Aplicação principal
- `mensagens.json`: Base de dados com 394 mensagens programadas
- `teste.js`: Script de teste para carregamento de mensagens
- `package.json`: Dependências (whatsapp-web.js, node-schedule)

## DEPLOY
Configurado para ambientes com recursos limitados (512MB RAM, headless browser otimizado).

## PROPÓSITO
Sistema automatizado para manter comunicação romântica consistente através do WhatsApp.
