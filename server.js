require('dotenv').config();


const TelegramService = require('./services/telegramService');
// Instanciar serviço do Telegram
const telegramService = new TelegramService();

// Iniciar bot do Telegram
console.log('🤖 Iniciando bot do Telegram...');
telegramService.start();

console.log('✅ Bot do Telegram iniciado com sucesso!');
console.log('📱 Aguardando mensagens no Telegram...');
