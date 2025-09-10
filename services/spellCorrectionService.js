const OpenAI = require('openai');

class SpellCorrectionService {
    constructor() {
        // Inicializar OpenAI para correções inteligentes
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }


    // Correção inteligente com IA
    async correctWithAI(message) {
        if (!message || typeof message !== 'string') {
            return message;
        }

        // Verificar se a API da OpenAI está configurada
        if (!process.env.OPENAI_API_KEY) {
            console.log('⚠️ OpenAI API key não configurada, usando correções básicas');
            return message;
        }

        try {
            const prompt = `Você é um assistente especializado em corrigir erros de digitação em mensagens sobre Pokémon. 
            
TAREFA: Corrigir apenas erros óbvios de digitação, mantendo a intenção original da mensagem.

REGRAS:
1. Corrija apenas erros claros de digitação (ex: charizad → charizard)
2. Mantenha a estrutura e intenção da mensagem
3. NÃO altere palavras que estão corretas
4. Foque em nomes de Pokémon e tipos
5. Se não houver erros óbvios, retorne a mensagem original
6. Responda APENAS com a mensagem corrigida, sem explicações
7. NÃO adicione aspas duplas na resposta

MENSAGEM ORIGINAL: ${message}

MENSAGEM CORRIGIDA:`;

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: prompt
                    }
                ],
                max_tokens: 100,
                temperature: 0.1, // Baixa temperatura para correções precisas
            });

            const rawResponse = completion.choices[0].message.content;
            // Limpar aspas duplas que possam ter sido adicionadas pela IA
            let correctedMessage = rawResponse.trim();
            
            // Remover aspas duplas do início e fim se existirem
            if (correctedMessage.startsWith('"') && correctedMessage.endsWith('"')) {
                correctedMessage = correctedMessage.slice(1, -1);
            }
            
            // Log apenas se houver mudança significativa
            if (correctedMessage !== message) {
                console.log(`🔍 Correção aplicada: "${message}" → "${correctedMessage}"`);
            }
            
            // Verificar se houve mudança significativa
            if (correctedMessage !== message && correctedMessage.length > 0) {
                console.log(`🤖 Correção IA: "${message}" → "${correctedMessage}"`);
                return correctedMessage;
            }
            
            return message;
        } catch (error) {
            console.error('Erro na correção com IA:', error.message);
            return message; // Retorna original em caso de erro
        }
    }

    // Função principal para corrigir mensagem completa
    async correctMessage(message) {
        if (!message || typeof message !== 'string') {
            return message;
        }

        // Aplicar apenas correção inteligente com IA
        try {
            const aiCorrected = await this.correctWithAI(message);
            return aiCorrected;
        } catch (error) {
            console.error('Erro na correção IA, retornando mensagem original:', error.message);
            return message; // Retorna original em caso de erro
        }
    }
}

module.exports = SpellCorrectionService;
