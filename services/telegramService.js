const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN } = require('../config/telegram');
const OpenAIService = require('./openaiService');
const PokemonService = require('./pokemonService');
const SpellCorrectionService = require('./spellCorrectionService');

class TelegramService {
    constructor() {
        this.bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
        this.openaiService = new OpenAIService();
        this.pokemonService = new PokemonService();
        this.spellCorrectionService = new SpellCorrectionService();
        this.setupHandlers();
    }

    setupHandlers() {
        // Mensagens de texto 
        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const message = msg.text;

            if (!message) {
                return;
            }

            try {
                // Mostrar que está processando
                await this.bot.sendChatAction(chatId, 'typing');

                // Corrigir erros de digitação na mensagem
                const correctedMessage = await this.spellCorrectionService.correctMessage(message);
                
                // Se houve correção, informar ao usuário
                if (correctedMessage !== message) {
                    console.log(`🔧 Mensagem corrigida: "${message}" → "${correctedMessage}"`);
                }

                // Detectar se a mensagem é sobre um Pokémon ou tipo
                const detection = this.openaiService.detectPokemonInMessage(correctedMessage);
                let pokemonData = null;
                let typeData = null;

                if (detection) {
                    if (detection.type === 'pokemon_name') {
                        try {
                            pokemonData = await this.pokemonService.getPokemon(detection.value);
                        } catch (pokemonError) {
                            console.log(`Erro ao buscar Pokémon ${detection.value}:`, pokemonError.message);
                        }
                    } else if (detection.type === 'pokemon_type') {
                        try {
                            const englishType = this.openaiService.convertTypeToEnglish(detection.value);
                            const pokemonList = await this.pokemonService.getPokemonByType(englishType);
                            
                            typeData = {
                                type: detection.value,
                                englishType: englishType,
                                pokemon: pokemonList
                            };
                        } catch (typeError) {
                            console.log(`Erro ao buscar tipo ${detection.value}:`, typeError.message);
                        }
                    }
                }

                // Gerar resposta usando OpenAI com a mensagem corrigida e sessionId baseado no chatId
                const sessionId = `telegram_${chatId}`;
                const response = await this.openaiService.generateResponse(correctedMessage, sessionId, pokemonData, typeData);
                
                this.bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
            } catch (error) {
                console.error('Erro ao processar mensagem:', error);
                this.bot.sendMessage(chatId, '❌ Desculpe, ocorreu um erro. Tente novamente em alguns instantes.');
            }
        });

        // Tratamento de erros
        this.bot.on('polling_error', (error) => {
            console.error('Erro no polling do Telegram:', error);
        });

        this.bot.on('error', (error) => {
            console.error('Erro no bot do Telegram:', error);
        });
    }

    start() {
        console.log('🤖 Bot do Telegram iniciado!');
        console.log('📱 Aguardando mensagens...');
    }

    stop() {
        this.bot.stopPolling();
        console.log('🛑 Bot do Telegram parado.');
    }
}

module.exports = TelegramService;
