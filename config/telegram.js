// Configuração do Telegram Bot
require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
    console.warn('⚠️  ATENÇÃO: Configure o token do Telegram no arquivo .env');
}

module.exports = {
    TELEGRAM_BOT_TOKEN
};
